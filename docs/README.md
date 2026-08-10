# Documentación de DNAture

Este directorio contiene únicamente documentación vigente. El código, las
migraciones y las pruebas son la fuente de verdad para detalles de
implementación; estos documentos explican contratos, decisiones y operación.

## Desarrollo

- [Arquitectura](./architecture.md): límites de los vertical slices y reglas de dependencias.
- [Sistema de diseño](./design-system.md): patrones visuales y componentes compartidos.
- [Operaciones](./operations.md): variables, despliegue, verificación y mantenimiento.
- [Datos y privacidad](./privacy.md): inventario técnico de datos y controles requeridos.

## Integraciones de catálogo

- [Gobierno de Contentful](./integrations/contentful-governance.md): propiedad del esquema, slugs y publicación.
- [Contentful–Avify](./integrations/contentful-avify-sku.md): contrato de SKU, verificación y recuperación.
- [Referencia de la API de Avify](./integrations/avify-api-reference.md): términos, límites y vacíos conocidos.

## Cuentas de clientes

- [Implementación de la Etapa 1](./accounts/stage-1-implementation.md): arquitectura, configuración y despliegue.
- [Mapa de requisitos por etapa](./accounts/README.md): alcance actual y dependencias.
- [Requisitos de Etapa 1](./accounts/stage-1-requirements.md): decisiones de producto y compuertas de lanzamiento.
- [Decisiones confirmadas de Etapa 1](./accounts/stage-1-decisions.md): responsables, proveedores y asuntos pendientes.
- [Etapa 2 — Red Veterinaria](./accounts/stage-2-red-veterinaria.md): alcance futuro separado.
- [Etapa 3 — promociones](./accounts/stage-3-promotions.md): alcance comercial futuro separado.

Los documentos de requisitos futuros no describen funcionalidad disponible.
Cada uno indica su estado y las decisiones necesarias antes de implementarlo.
