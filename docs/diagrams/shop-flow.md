# Flujo de compra asistida de DNAture

Este diagrama describe el comportamiento implementado. DNAture conserva los
patrones habituales de exploración, carrito, checkout y revisión, pero sustituye
el pago y la creación automática del pedido por una coordinación manual en
WhatsApp.

```mermaid
flowchart TD
    A[Cliente llega a la tienda] --> B[Explora categorías o busca productos]
    B --> C[Revisa producto y presentación]
    C --> D[Agrega productos al carrito]
    D --> E{¿Desea seguir comprando?}
    E -- Sí --> B
    E -- No --> F[Revisa cantidades e indicaciones]
    F --> G[Inicia la solicitud]

    G --> H[Elige retiro o entrega]
    H --> I[Indica una preferencia de pago]
    I --> J[El servidor comprueba productos y precios en Contentful]
    J --> K{¿Cambió el catálogo?}
    K -- Sí --> L[Actualiza el carrito y solicita otra revisión]
    L --> F
    K -- No --> M{¿Hay una sesión activa?}

    M -- Sí --> N[Precarga perfil y dirección guardados]
    M -- No --> O[Continúa como invitado]
    N --> P[Revisa o completa sus datos]
    O --> P
    P --> Q[Revisa el resumen y total estimado]
    Q --> R{¿Necesita corregir algo?}
    R -- Sí --> F
    R -- No --> S[Intenta generar y descargar la imagen]
    S --> SI{¿La imagen está disponible?}
    SI -- Sí --> T[Abre el mensaje preparado en WhatsApp]
    SI -- No --> T
    T --> U[Cliente adjunta la imagen si está disponible y envía]
    U --> V[DNAture confirma inventario, monto, pago y modalidad]
    V --> W{¿Cliente acepta?}
    W -- No --> X[Ajusta o cancela por WhatsApp]
    W -- Sí --> Y[Realiza el pago acordado]
    Y --> Z[DNAture prepara la solicitud confirmada]
    Z --> AA[Retiro o entrega coordinados]
```

## Límites del sistema

- El carrito no reserva inventario.
- La comprobación de Contentful valida que un producto siga publicado y que el
  precio coincida; no consulta existencias.
- La referencia `DN-…` y la imagen se generan en el navegador; no son un número
  de pedido proveniente de un backend.
- El mensaje de WhatsApp incluye un resumen limitado de productos como
  contingencia si falla la imagen.
- Abrir WhatsApp no adjunta la imagen ni envía el mensaje automáticamente.
- Solo la respuesta de DNAture confirma disponibilidad, monto, pago y entrega.
- El sitio no procesa pagos ni mantiene estados de pedido.
