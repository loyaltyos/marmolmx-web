# MarmolMX Web

Sitio corporativo y catálogo de MarmolMX con carrito, checkout, persistencia de órdenes en Supabase y procesamiento de pagos con OpenPay Sandbox.

## Requisitos

- Node.js compatible con Next.js 16
- npm para Windows (`npm.cmd`)
- Proyecto Supabase con el esquema de `supabase/schema.sql`
- Cuenta OpenPay Sandbox para pruebas de pago

## Desarrollo local

```powershell
npm.cmd install
npm.cmd run dev
```

Abre `http://localhost:3000`. Si el puerto está ocupado:

```powershell
npm.cmd run dev -- -p 3001
```

Para validar producción:

```powershell
npm.cmd run lint
npm.cmd run build
```

## Variables de entorno

Crea `.env.local` a partir de `.env.local.example`.

```dotenv
# OpenPay Sandbox
NEXT_PUBLIC_OPENPAY_MERCHANT_ID=
NEXT_PUBLIC_OPENPAY_PUBLIC_KEY=
NEXT_PUBLIC_OPENPAY_SANDBOX=true
OPENPAY_PRIVATE_KEY=
OPENPAY_SANDBOX=true

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

`OPENPAY_PRIVATE_KEY` y `SUPABASE_SERVICE_ROLE_KEY` son secretos exclusivos del servidor. Nunca deben exponerse en componentes cliente, repositorios públicos o capturas de pantalla.

## Probar OpenPay Sandbox

1. Ejecuta `supabase/schema.sql` en el SQL Editor de Supabase.
2. Completa las credenciales Sandbox en `.env.local`.
3. Reinicia el servidor de desarrollo después de modificar variables.
4. Agrega un producto al carrito y abre `/checkout`.
5. Usa una tarjeta de prueba autorizada por OpenPay Sandbox.
6. Confirma en Supabase:
   - `orders.status = 'paid'` si OpenPay aprueba.
   - `orders.status = 'payment_failed'` si OpenPay rechaza.
   - Existe un registro asociado en `payments`.

La tarjeta se tokeniza directamente con OpenPay.js. El servidor recibe únicamente `order_id`, `token_id` y `device_session_id`.

El esquema incluye `record_openpay_payment`, una función transaccional que registra el pago aprobado con proveedor `openpay` y actualiza la orden a `paid` en la misma operación.

## Antes de producción

Reemplaza las credenciales Sandbox por las credenciales de producción:

```dotenv
NEXT_PUBLIC_OPENPAY_MERCHANT_ID=
NEXT_PUBLIC_OPENPAY_PUBLIC_KEY=
OPENPAY_PRIVATE_KEY=
NEXT_PUBLIC_OPENPAY_SANDBOX=false
OPENPAY_SANDBOX=false
```

Mantén las llaves privadas únicamente en el gestor de variables del hosting. Revisa también el contenido legal con el responsable jurídico del comercio antes de publicar.

## Checklist OpenPay

- [ ] El sitio usa HTTPS en producción.
- [ ] Nombre comercial, teléfono, correo y zona de servicio son visibles.
- [ ] El footer enlaza términos, privacidad, devoluciones y entregas.
- [ ] El checkout informa que OpenPay tokeniza la tarjeta.
- [ ] MarmolMX no almacena número de tarjeta ni CVV.
- [ ] `OpenPay.deviceData.setup` genera `device_session_id`.
- [ ] El pago se detiene si falta `device_session_id`.
- [ ] El backend recibe solo `order_id`, `token_id` y `device_session_id`.
- [ ] La orden se crea antes de intentar cobrar.
- [ ] Pagos aprobados y rechazados se registran en Supabase.
- [ ] Las variables Sandbox cambian a producción antes del lanzamiento.

## Rutas legales

- `/terminos-y-condiciones`
- `/aviso-de-privacidad`
- `/politica-de-devoluciones`
- `/envios-y-entregas`
