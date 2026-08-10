# Mi DNAture — implementación de cuentas de clientes, Etapa 1

**Estado:** implementación completa; migración base alojada y ajuste sin mascota principal validado localmente, pendiente de aplicar al proyecto alojado
**Fecha de corte:** 9 de agosto de 2026  
**Mercado e idioma:** Costa Rica, interfaz `es-CR`  
**Responsable de producto:** Julio Zeledon

## Resultado implementado

La propuesta de frontend se convirtió en una vertical funcional dentro del mismo proyecto Next.js. El sitio público y el carrito para invitados continúan abiertos; las rutas de `Mi DNAture` usan sesiones reales y datos privados de Supabase cuando se configuran las credenciales.

La Etapa 1 incluye:

- Registro público controlado por compuerta, acceso por invitación y sesión con código de seis dígitos por correo.
- Acceso con Google mediante OAuth y PKCE.
- Renovación de sesión en el proxy de Next.js y comprobación de identidad nuevamente junto a cada lectura o mutación.
- Panel personal, perfil, teléfono y una dirección frecuente de Costa Rica.
- Creación, edición, selección y eliminación de hasta diez perfiles de perros.
- Hasta cinco carritos guardados, recuperación con confirmación y reconciliación contra el catálogo y los precios publicados actuales.
- Persistencia del carrito activo de invitado en el navegador, sin datos personales, para conservarlo durante el acceso.
- Prellenado opcional del formulario de checkout con el perfil autenticado; la persona todavía revisa y envía los datos mediante el flujo existente.
- Estados vacíos, errores recuperables, carga y acceso no configurado en español.
- Diseño móvil primero: acceso antes del contenido promocional, controles que ajustan línea y protección contra desbordamiento horizontal.

No se incluyeron pagos, pedidos, facturas, suscripciones, Red Veterinaria, aliados, promociones, descuentos, recomendaciones ni recordatorios.

## Compuertas funcionales

| Variable | Valor seguro inicial | Efecto |
| --- | --- | --- |
| `ACCOUNT_REGISTRATION_MODE` | `invitation` | Oculta el alta pública y presenta el piloto por invitación. La restricción real también debe aplicarse en Supabase Auth. |
| `ACCOUNT_PORTION_PLANNING_ENABLED` | `false` | No calcula ni presenta porciones hasta recibir aprobación clínica escrita. |
| `ACCOUNT_STAGE_2_ENABLED` | `false` | Reserva la compuerta de Etapa 2; Red Veterinaria no tiene ruta ni navegación disponible. |

Para una demostración local del alta puede usarse `ACCOUNT_REGISTRATION_MODE=public`. Esto no debe habilitarse en Netlify mientras Supabase permita altas abiertas sin las compuertas de lanzamiento.

## Arquitectura

| Capa | Responsabilidad |
| --- | --- |
| `app/cuenta/(autenticada)` | Límite de rutas privadas y carga inicial de la cuenta. |
| `app/cuenta/iniciar-sesion` | Entrada por correo o Google, con modo de invitación o registro público. |
| `app/auth/callback` | Intercambio del código PKCE por sesión y redirección interna validada. |
| `features/Account` | Validación, acciones de servidor, mapeo de datos y estado autenticado. |
| `services/supabase` | Clientes de navegador/servidor y renovación de cookies. |
| `proxy.js` | Renovación optimista y redirección de rutas privadas; no sustituye RLS. |
| `supabase/migrations` | Esquema, índices, triggers, RPC y políticas versionadas. |

El proxy solo se ejecuta en `/cuenta`, `/auth`, `/checkout` y la ruta diagnóstica existente. De esta forma, navegar el catálogo público no agrega una consulta de autenticación. Las rutas que usan una sesión son dinámicas y no se almacenan en caché compartida.

La aplicación usa `@supabase/ssr` y una llave publicable. No necesita ni admite una llave `service_role` o `sb_secret` en el navegador. La orientación oficial para SSR está en [Supabase Auth con Next.js](https://supabase.com/docs/guides/auth/server-side/creating-a-client).

## Modelo de datos y seguridad

La migración `202608090001_stage_1_customer_accounts.sql` crea:

- `customer_profiles`
- `customer_addresses`
- `customer_preferences`
- `customer_pets`
- `customer_saved_carts`
- `customer_saved_cart_items`

La migración compensatoria `202608100001_remove_primary_pet.sql` elimina la
designación persistente de mascota principal y las funciones que dependían de
ella. Elegir una mascota en el resumen solo cambia temporalmente el perfil
visible en esa pantalla.

Cada tabla expuesta tiene RLS habilitado, propietario obligatorio relacionado con `auth.users`, índices de propiedad y políticas separadas para las operaciones permitidas. Los elementos de un carrito usan una llave foránea compuesta `(cart_id, user_id)`, por lo que no pueden asociarse a un carrito de otra cuenta.

Las reglas que no deben depender del navegador también existen en PostgreSQL:

- Límites de mascotas, carritos e ítems con serialización por cuenta.
- Perfiles de mascotas sin jerarquías y una sola dirección marcada como predeterminada.
- Rangos, longitudes, valores permitidos y moneda CRC.
- Guardado transaccional de carrito.
- Eliminación de perfiles de mascotas protegida por RLS, sin promover ni priorizar otro perfil.
- RPC disponibles solo para el rol `authenticated` y ejecutados como la persona que llama, por lo que continúan sujetos a RLS.

La llave publicable es intencionalmente visible; [RLS es la barrera de autorización](https://supabase.com/docs/guides/database/postgres/row-level-security). Nunca se debe agregar una llave que omita RLS a este flujo.

## Variables necesarias

Agregar a `.env.local` sin compartir sus valores por chat:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
ACCOUNT_REGISTRATION_MODE=public
ACCOUNT_PORTION_PLANNING_ENABLED=false
ACCOUNT_STAGE_2_ENABLED=false
```

`NEXT_PUBLIC_SITE_URL` ya debe conservar el origen canónico `https://dnaturefood.com`.

La URL y la llave publicable se obtienen en **Supabase Dashboard → Connect** o **Project Settings → API Keys**. Son valores públicos. La contraseña de Postgres, el token personal de Supabase, la llave de Resend y el secreto de Google no van en `.env.local`, Netlify ni el repositorio.

## Validación local sin otro proyecto alojado

El stack local de Supabase es un conjunto descartable de contenedores y no crea un segundo proyecto en la nube:

```bash
npm run supabase:start
npm run supabase:reset
npm run supabase:lint
npm run supabase:test
npm test
npm run lint
npm run check:architecture
npm run build
```

Los correos locales aparecen en Mailpit en `http://127.0.0.1:54324`; no usan Resend. Antes de aplicar cambios remotos, las pruebas SQL deben demostrar con dos usuarios que A no puede leer, editar, borrar ni relacionar datos de B y que un usuario anónimo no ve datos.

## Aplicar la migración al único proyecto alojado

1. Iniciar sesión localmente con `npx supabase login`. El token `sbp_...` se ingresa directamente en la herramienta; no se guarda en el proyecto.
2. Ejecutar `npx supabase link --project-ref <PROJECT_REF>` e ingresar la contraseña de Postgres en el prompt.
3. Revisar `npx supabase migration list`.
4. Ejecutar `npx supabase db push --dry-run`.
5. Confirmar que solamente se aplicará la migración esperada.
6. Ejecutar `npx supabase db push` una sola vez.
7. Revisar RLS y Security Advisor en Supabase.

No ejecutar `supabase db reset --linked`, no usar `--include-seed`, no pegar la migración manualmente en SQL Editor y no cambiar tablas remotas fuera de migraciones. Tampoco ejecutar `supabase config push`: el archivo local contiene la URL de `localhost` y podría sobrescribir la configuración alojada. El flujo de referencia está en [migraciones de base de datos de Supabase](https://supabase.com/docs/guides/deployment/database-migrations).

## Configuración de Supabase Auth

En **Auth → URL Configuration**:

- Site URL: `https://dnaturefood.com`
- `https://dnaturefood.com/auth/callback`
- `http://localhost:3000/auth/callback`
- `http://127.0.0.1:3000/auth/callback`

En correo/autenticación:

- Código de seis dígitos.
- Vencimiento: 900 segundos.
- Frecuencia mínima de reenvío: 60 segundos.
- Asunto: `Tu código para ingresar a Mi DNAture`.
- Plantilla Magic Link: contenido de `supabase/templates/magic_link.html`, que usa `{{ .Token }}`.

Para el piloto, deshabilitar **Allow new users to sign up** en el proyecto alojado y crear previamente las cuentas sintéticas/invitadas aprobadas. La UI por sí sola no es una barrera de seguridad. Para el lanzamiento público se deben aprobar y probar límites, CAPTCHA, monitoreo y soporte antes de habilitar simultáneamente esa opción y `ACCOUNT_REGISTRATION_MODE=public`. Supabase documenta el flujo OTP en [email passwordless](https://supabase.com/docs/guides/auth/auth-email-passwordless).

## Resend

Configuración recomendada para la cuenta propiedad de `julio.zeledon@dnaturefood.com`:

1. Agregar y verificar `cuentas.dnaturefood.com` en Resend.
2. Copiar exactamente los registros SPF, DKIM y MX entregados por Resend a Netlify DNS. No reemplazar registros existentes del dominio raíz.
3. Crear una llave Resend dedicada a Supabase Auth.
4. Configurar en **Supabase Auth → SMTP**:
   - Host: `smtp.resend.com`
   - Puerto: `465`
   - Usuario: `resend`
   - Contraseña: llave `re_...`
   - Remitente propuesto: `no-reply@cuentas.dnaturefood.com`
   - Nombre propuesto: `DNAture`

La identidad final del remitente y cualquier `reply-to` requieren confirmación de producto/operaciones. La llave de Resend vive únicamente en Supabase. Referencias: [Resend con Supabase](https://resend.com/docs/knowledge-base/getting-started-with-resend-and-supabase) y [dominios de Resend](https://resend.com/docs/dashboard/domains/introduction).

## Google OAuth

En Google Cloud, crear un cliente **Web application** propiedad de DNAture:

- Authorized JavaScript origins: `https://dnaturefood.com` y `http://localhost:3000`.
- Authorized redirect URI: `https://<PROJECT_REF>.supabase.co/auth/v1/callback`.

Ese redirect de Google no es el callback de la aplicación. El flujo es Google → Supabase → `https://dnaturefood.com/auth/callback`. El Client ID y Client Secret se configuran solo en **Supabase Auth → Providers → Google**. No solicitar scopes adicionales a identidad básica. Ver [Google Auth con Supabase](https://supabase.com/docs/guides/auth/social-login/auth-google).

## Netlify

Agregar en **Project configuration → Environment variables**, con alcance Builds y Functions y contexto Production:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SITE_URL=https://dnaturefood.com`
- `ACCOUNT_REGISTRATION_MODE=invitation`
- `ACCOUNT_PORTION_PLANNING_ENABLED=false`
- `ACCOUNT_STAGE_2_ENABLED=false`

No entregar credenciales de Supabase a Deploy Previews por ahora. Los previews mostrarán el estado seguro “Mi DNAture estará disponible pronto” y no consultarán el único proyecto real. Netlify soporta el App Router/SSR mediante OpenNext sin agregar un plugin manual: [Next.js en Netlify](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/).

## Evidencia disponible

- 180 pruebas unitarias aprobadas al momento de esta implementación.
- ESLint y límites de arquitectura aprobados.
- Cuatro pruebas Playwright aprobadas para entrada protegida, interfaz configurada, validación local y ancho de 320 px; el escenario alternativo sin configuración se omitió porque este entorno sí tiene variables presentes.
- 52 pruebas pgTAP estructurales y funcionales de RLS aprobadas en el stack local, incluyendo aislamiento entre dos clientes, permisos anónimos y operaciones transaccionales.
- Migración `202608090001` aplicada y registrada en el proyecto alojado; historial local/remoto sincronizado y lint remoto sin errores.
- Migración `202608100001` validada mediante reconstrucción local completa, lint de base de datos y pruebas pgTAP; pendiente aplicarla al proyecto alojado.
- Compilación completa de Next.js 16.3.0 aprobada con el catálogo determinista de pruebas (`E2E_USE_FIXTURES=1`), sin depender de Contentful durante la validación aislada.
- Auditoría de dependencias de producción sin vulnerabilidades conocidas (`npm audit --omit=dev`).

La evidencia pendiente requiere activar Auth en el proyecto alojado: recibir un OTP real, completar Google, renovar una sesión, probar dos cuentas separadas, validar correo móvil y hacer smoke test en Netlify Production.

## Requisitos antes de datos reales o lanzamiento público

La implementación puede probarse con datos sintéticos. Antes de invitar clientes reales todavía se requiere:

- Entidad legal operadora, contacto de privacidad, asesoría y textos aprobados.
- Inventario de datos, propósitos, retención, exportación, corrección y eliminación.
- Flujos de cambio de correo, eliminación de cuenta y recuperación operativa.
- Revisión de proveedores y accesos administrativos.
- Remitente Resend, dominio, monitoreo de rebotes y canal de soporte.
- Reglas de vinculación de identidades y resolución de cuentas duplicadas.
- CAPTCHA, límites alojados, alertas de autenticación y umbrales de pausa.
- Duración, participantes, dispositivos, criterios de éxito y rollback del piloto.
- Pruebas de restauración/backups, revisión de dependencias y prueba de carga/abuso.

La planificación de porciones permanece apagada hasta la aprobación escrita de Sofía Aguilar. Red Veterinaria y promociones conservan sus propios documentos de Etapa 2 y Etapa 3 y no bloquean esta base.

## Rollback seguro

Ante un problema durante el piloto:

1. Deshabilitar nuevas altas en Supabase Auth.
2. Retirar las variables Supabase del contexto Production de Netlify o despublicar el deploy afectado.
3. Mantener el carrito y catálogo públicos operativos; el acceso mostrará el estado no configurado.
4. No ejecutar un reset remoto. Corregir el esquema mediante una nueva migración compensatoria.
5. Preservar evidencia técnica sin registrar correo, teléfono, dirección ni datos de mascotas.
