create extension if not exists pgcrypto;

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  address text,
  notes text,
  created_at timestamptz default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id),
  order_number text unique not null,
  status text not null default 'pending_payment',
  subtotal numeric not null,
  total numeric not null,
  currency text not null default 'MXN',
  source text default 'website',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id text not null,
  product_name text not null,
  category text,
  quantity integer not null,
  unit_price numeric not null,
  line_total numeric not null,
  created_at timestamptz default now()
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  provider text not null default 'openpay',
  provider_payment_id text,
  provider_status text,
  amount numeric not null,
  currency text not null default 'MXN',
  raw_response jsonb,
  created_at timestamptz default now()
);

create or replace function record_openpay_payment(
  p_order_id uuid,
  p_provider_payment_id text,
  p_provider_status text,
  p_amount numeric,
  p_currency text,
  p_raw_response jsonb
)
returns void
language plpgsql
set search_path = public
as $$
begin
  insert into payments (
    order_id,
    provider,
    provider_payment_id,
    provider_status,
    amount,
    currency,
    raw_response
  )
  values (
    p_order_id,
    'openpay',
    p_provider_payment_id,
    p_provider_status,
    p_amount,
    p_currency,
    p_raw_response
  );

  update orders
  set status = 'paid', updated_at = now()
  where id = p_order_id;

  if not found then
    raise exception 'OpenPay order not found';
  end if;
end;
$$;

create table if not exists contact_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  project_type text,
  message text not null,
  source text default 'website',
  status text default 'new',
  created_at timestamptz default now()
);
