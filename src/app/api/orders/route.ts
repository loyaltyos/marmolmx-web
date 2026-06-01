import { NextResponse } from "next/server";
import { products } from "@/data/products";
import {
  createSupabaseServerClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";

type CreateOrderRequest = {
  customer?: {
    full_name?: unknown;
    phone_number?: unknown;
    email?: unknown;
    delivery_zone?: unknown;
    notes?: unknown;
  };
  items?: Array<{
    product_id?: unknown;
    quantity?: unknown;
  }>;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+?[\d\s()-]{10,20}$/;

export async function POST(request: Request) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        {
          error:
            "Supabase no está configurado. Agrega NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY.",
          code: "SUPABASE_NOT_CONFIGURED",
        },
        { status: 503 },
      );
    }

    const body = (await request.json()) as CreateOrderRequest;
    const validation = validateOrder(body);

    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const supabase = createSupabaseServerClient();
    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .insert({
        full_name: validation.customer.fullName,
        email: validation.customer.email,
        phone: validation.customer.phone,
        address: validation.customer.address || null,
        notes: validation.customer.notes || null,
      })
      .select("id")
      .single();

    if (customerError || !customer) {
      throw new Error("No fue posible guardar los datos del cliente.");
    }

    const orderNumber = createOrderNumber();
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_id: customer.id,
        order_number: orderNumber,
        status: "pending_payment",
        subtotal: validation.total,
        total: validation.total,
        currency: "MXN",
        source: "website",
      })
      .select("id, order_number, total")
      .single();

    if (orderError || !order) {
      await supabase.from("customers").delete().eq("id", customer.id);
      throw new Error("No fue posible crear la orden.");
    }

    const { error: itemsError } = await supabase.from("order_items").insert(
      validation.items.map((item) => ({
        order_id: order.id,
        product_id: String(item.product.id),
        product_name: item.product.name,
        category: item.product.category,
        quantity: item.quantity,
        unit_price: item.product.price,
        line_total: item.product.price * item.quantity,
      })),
    );

    if (itemsError) {
      await supabase.from("orders").delete().eq("id", order.id);
      await supabase.from("customers").delete().eq("id", customer.id);
      throw new Error("No fue posible guardar los productos de la orden.");
    }

    return NextResponse.json(
      {
        order_id: order.id,
        order_number: order.order_number,
        total: Number(order.total),
      },
      { status: 201 },
    );
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Order creation failed:", error);
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No fue posible crear la orden.",
      },
      { status: 500 },
    );
  }
}

function validateOrder(body: CreateOrderRequest) {
  const fullName =
    typeof body.customer?.full_name === "string"
      ? body.customer.full_name.trim()
      : "";
  const phone =
    typeof body.customer?.phone_number === "string"
      ? body.customer.phone_number.trim()
      : "";
  const email =
    typeof body.customer?.email === "string"
      ? body.customer.email.trim().toLowerCase()
      : "";
  const address =
    typeof body.customer?.delivery_zone === "string"
      ? body.customer.delivery_zone.trim()
      : "";
  const notes =
    typeof body.customer?.notes === "string"
      ? body.customer.notes.trim()
      : "";

  if (!fullName || fullName.length < 3) {
    return { ok: false as const, error: "Ingresa el nombre completo." };
  }

  if (!emailPattern.test(email)) {
    return { ok: false as const, error: "Ingresa un correo válido." };
  }

  if (!phonePattern.test(phone)) {
    return { ok: false as const, error: "Ingresa un teléfono válido." };
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return { ok: false as const, error: "El carrito está vacío." };
  }

  let total = 0;
  const items = [];

  for (const item of body.items) {
    const productId = Number(item.product_id);
    const quantity = Number(item.quantity);
    const product = products.find((candidate) => candidate.id === productId);

    if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      return { ok: false as const, error: "El carrito contiene datos inválidos." };
    }

    total += product.price * quantity;
    items.push({ product, quantity });
  }

  return {
    ok: true as const,
    customer: { fullName, phone, email, address, notes },
    items,
    total,
  };
}

function createOrderNumber() {
  const date = new Date();
  const datePart = date.toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = crypto.randomUUID().slice(0, 8).toUpperCase();
  return `MMX-${datePart}-${randomPart}`;
}
