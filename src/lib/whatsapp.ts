import { WHATSAPP_NUMBER } from "@/config/site";
import type { CartItem } from "@/components/CartProvider";
import type { Product } from "@/data/products";

const mxn = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

export function createWhatsAppUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function createProductWhatsAppUrl(product: Product) {
  return createWhatsAppUrl(
    [
      "Hola MarmolMX, estoy interesado en el producto:",
      product.name,
      `Precio estimado: ${mxn.format(product.price)} MXN`,
      "¿Podrían brindarme más información?",
    ].join("\n"),
  );
}

export function createCartWhatsAppUrl(items: CartItem[]) {
  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const lines = items.map(
    (item) =>
      `- ${item.product.name} x${item.quantity} — ${mxn.format(
        item.product.price * item.quantity,
      )} MXN`,
  );

  return createWhatsAppUrl(
    [
      "Hola MarmolMX, estoy interesado en los siguientes productos:",
      "",
      ...lines,
      "",
      `Total estimado: ${mxn.format(total)} MXN`,
      "",
      "¿Podrían brindarme más información y cotización final?",
    ].join("\n"),
  );
}
