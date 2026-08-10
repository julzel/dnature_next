# Flujo de referencia para ecommerce

Este es el recorrido habitual de una compra en línea. Sirve como referencia de
producto; no afirma que DNAture implemente pagos, inventario u órdenes en su
sistema actual. La adaptación vigente está en
[el flujo de compra asistida](./shop-flow.md).
La [exportación SVG ampliada](./shop-flow-diagram.svg) conserva el mapa visual
usado durante el análisis inicial.

```mermaid
flowchart TD
    A[Descubre la tienda] --> B[Busca o explora categorías]
    B --> C[Revisa producto, presentación, precio y disponibilidad]
    C --> D[Agrega al carrito]
    D --> E{¿Continúa comprando?}
    E -- Sí --> B
    E -- No --> F[Revisa cantidades, descuentos y estimado]
    F --> G[Inicia checkout]
    G --> H{¿Tiene cuenta?}
    H -- Sí --> I[Inicia sesión y recupera datos]
    H -- No --> J[Continúa como invitado o crea cuenta]
    I --> K[Confirma contacto y dirección]
    J --> K
    K --> L[Elige entrega o retiro]
    L --> M[Revisa tarifas, impuestos y fecha estimada]
    M --> N[Elige método de pago]
    N --> O[Revisión final]
    O --> P[Servidor valida catálogo, precio e inventario]
    P --> Q{¿La información sigue vigente?}
    Q -- No --> R[Explica cambios y devuelve a revisión]
    R --> F
    Q -- Sí --> S{¿Pago en línea?}
    S -- Sí --> T[Autoriza el pago]
    T --> U{¿Pago aprobado?}
    U -- No --> V[Corrige o cambia el método]
    V --> N
    U -- Sí --> W[Crea el pedido de forma idempotente]
    S -- No --> W
    W --> X[Reserva o descuenta inventario]
    X --> Y[Envía confirmación y número de pedido]
    Y --> Z[Preparación y entrega o retiro]
    Z --> AA[Soporte, seguimiento y posventa]
    AA --> AB[Recompra y personalización con consentimiento]
```

## Controles que no se deben omitir

- El servidor vuelve a calcular precios y totales; no confía en `localStorage`.
- La creación del pedido es idempotente para evitar duplicados.
- El inventario se reserva únicamente cuando el sistema puede demostrarlo.
- El pago autorizado y el pedido aceptado son estados distintos.
- Los errores permiten corregir y reintentar sin perder el carrito.
- La confirmación muestra referencia, monto, modalidad y siguiente paso.
- La posventa incluye soporte, cancelaciones, devoluciones y seguimiento según
  la política comercial aprobada.
