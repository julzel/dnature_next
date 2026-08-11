# Implementación del flujo de compra asistida

**Estado:** implementado en frontend y acciones de servidor; requiere
validación operativa antes de producción.

## Resultado

El checkout conserva el patrón convencional de catálogo → carrito → datos →
revisión, pero termina en un traspaso explícito a WhatsApp. No crea un pedido,
reserva inventario ni cobra en línea.

Los principales cambios son:

- lenguaje de “solicitud” y estados que no implican una compra confirmada;
- selección explícita entre pasar a retirar y entrega a domicilio;
- preferencia de SINPE Móvil o pago por coordinar, sin efectuar cobros;
- indicaciones del pedido persistidas en el estado del carrito;
- dirección requerida únicamente para entrega;
- selector validado de provincias de Costa Rica;
- acceso opcional a Mi DNAture para precargar datos, sin bloquear invitados;
- revisión editable antes de generar el resumen;
- imagen con referencia única y descarga repetible;
- mensaje de WhatsApp preparado con referencia y datos no personales;
- referencias locales diferenciadas de pedidos enviados; y
- número oficial de WhatsApp centralizado en `constants/contact.js`.

## Comprobación del catálogo

Antes de solicitar datos personales, `features/Cart/actions.js` obtiene el
catálogo publicado mediante la entrada pública de Catalog y reconcilia cada
artículo por identificador de Contentful o SKU:

- elimina productos que dejaron de estar publicados;
- actualiza precios que cambiaron;
- conserva cantidades enteras entre 1 y 99; y
- obliga a revisar nuevamente cuando hubo cambios.

Contentful es la fuente de descripción y precio neto para el sitio. El checkout
calcula un 13 % de IVA sobre el subtotal. Esta operación no consulta inventario
en Avify ni garantiza disponibilidad. El monto final continúa sujeto a la
confirmación manual de DNAture.

## Datos y persistencia

El carrito activo guarda únicamente artículos en el navegador. La modalidad,
preferencia de pago, datos personales e indicaciones no se restauran con ese
registro después de una recarga.

Al preparar una solicitud se conserva por 30 días una referencia local con los
artículos, fecha, identificador generado y modalidad. No contiene datos del
cliente, dirección, pago ni indicaciones. Las versiones anteriores se migran a
este formato minimizado al abrir el sitio. La imagen PNG sí contiene el resumen
visible y queda bajo control del dispositivo del cliente.

Un cliente autenticado puede guardar selecciones en Supabase. Esos registros no
son pedidos y también se reconcilian contra el catálogo actual al recuperarlos.

## Traspaso a WhatsApp

`features/Cart/lib/whatsapp-order.js` construye un enlace al número E.164
centralizado. El texto incluye hasta doce líneas de productos, referencia,
total estimado, modalidad y preferencia de pago; no incluye nombre, correo,
teléfono, dirección ni indicaciones libres.

Abrir el enlace revela ese texto a WhatsApp/Meta. La imagen no se carga ni se
adjunta mediante la aplicación: el cliente debe adjuntarla y enviar el mensaje
manualmente. Si la captura o la descarga falla, el resumen de productos permite
continuar por WhatsApp; un fallo al guardar la referencia local tampoco bloquea
el traspaso.

## Contrato comercial confirmado

- Los precios publicados en Contentful son netos y no incluyen IVA.
- El checkout agrega un 13 % de IVA al subtotal.
- Cada solicitud con entrega agrega una tarifa estimada de ₡3.500; DNAture
  confirma manualmente la cobertura antes de aceptar el pedido.
- El cliente puede escribir por WhatsApp las 24 horas. La atención se realiza
  de lunes a viernes, de 8:00 a. m. a 5:00 p. m., y sábados, de 8:00 a. m. a
  4:30 p. m., con respuesta dentro de dos horas hábiles.

Antes del lanzamiento debe documentarse el responsable operativo y la
contingencia cuando el canal no esté disponible.

## Fuera de alcance

- Inventario disponible o reserva de existencias.
- API o base de datos de pedidos.
- Pago en línea o verificación automática de SINPE.
- Estados, historial, cancelación o seguimiento de pedidos.
- Facturación, devoluciones y reembolsos.
- Envío automático de archivos a WhatsApp.

El recorrido completo está en [el diagrama de compra](./diagrams/shop-flow.md) y
las instrucciones para clientes en [la guía de uso](./user-guide.md).
