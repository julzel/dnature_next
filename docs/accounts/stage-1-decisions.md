# Stage 1 — Registro de decisiones para cuentas de clientes

**Estado:** Implementación técnica autorizada; activación con clientes reales bloqueada por decisiones pendientes  
**Fecha de la aprobación inicial:** 9 de agosto de 2026  
**Fuente:** Confirmación directa del enlace de producto, Julio Zeledon

Este registro convierte las confirmaciones del product owner en decisiones trazables para la implementación de la Etapa 1. No sustituye las aprobaciones legales, clínicas u operativas requeridas en el documento de requisitos.

## Autoridad y responsables

| Responsabilidad | Persona o cuenta confirmada | Estado |
| --- | --- | --- |
| Product owner responsable | Julio Zeledon | Aprobado |
| Patrocinadora ejecutiva y autoridad presupuestaria | Yerlin Marquez | Aprobado |
| Aprobadora legal y de privacidad | Yerlin Marquez | Aprobado |
| Autoridad veterinaria/clínica | Sofía Aguilar | Aprobado |
| Responsable de soporte y operaciones | Laura Vargas | Aprobado |
| Autoridad final ante conflictos | Julio Zeledon | Aprobado |

## Alcance aprobado

- Registro e inicio de sesión.
- Panel de cliente.
- Perfil y direcciones de Costa Rica.
- Perfiles de mascotas.
- Planificación de porciones, condicionada a la aprobación clínica de la fórmula y los textos.
- Carritos guardados y restauración del carrito.
- Las recomendaciones personalizadas y los recordatorios quedan diferidos dentro de la Etapa 1 hasta aprobar sus reglas de datos, consentimiento y revisión clínica.
- Se excluyen pagos, historial de pedidos, facturas, suscripciones, entregas recurrentes, Red Veterinaria, promociones y descuentos.
- La navegación, compra asistida y uso del carrito como invitado continúan sin requerir una cuenta ni pago en línea.

## Arquitectura y proveedores aprobados

| Capacidad | Decisión | Propietario confirmado |
| --- | --- | --- |
| Autenticación y base de datos | Supabase Auth y Supabase Postgres con RLS | `julio.zeledon@dnaturefood.com` |
| Hosting | Netlify | `jusher22@gmail.com` |
| Correo transaccional | Resend | `julio.zeledon@dnaturefood.com` |
| Dominio y DNS | `dnaturefood.com` mediante Netlify | `julio.zeledon@dnaturefood.com` |
| OAuth de Google | Aplicación propiedad de DNAture | `julio.zeledon@dnaturefood.com` |
| OAuth de Meta | Aplicación propiedad de DNAture | `julio.zeledon@dnaturefood.com` |
| Ambientes de desarrollo, staging y producción | Bajo la cuenta de Netlify confirmada | `jusher22@gmail.com` |

Decisiones técnicas aprobadas:

- Inicio inicial con código de un solo uso por correo y Google.
- Facebook se implementará después de la base inicial de autenticación.
- Instagram queda excluido mientras Meta no confirme un flujo de identidad adecuado.
- RLS debe estar habilitado desde la primera migración en toda tabla propiedad del cliente.
- Los secretos se administrarán mediante las variables de entorno aprobadas; nunca se guardarán en documentos ni en el cliente.
- No se habilitará analítica de cuentas hasta aprobar proveedor, consentimiento y eventos permitidos.

## Mercado, accesibilidad y acceso

- Mercado principal: Costa Rica.
- Una dirección guardada no constituye una promesa de cobertura de entrega.
- Experiencia principal: móvil.
- Objetivo de accesibilidad: WCAG 2.2 AA.
- No habrá interfaz de administración para personal en la Etapa 1.
- El acceso a infraestructura de producción se limitará a administradores nombrados.
- Edad mínima confirmada para servicios en línea: 18 años; no se permitirán cuentas de menores durante esta etapa.
- El lanzamiento comenzará con personal y personas invitadas; el registro público requiere completar las compuertas legales, clínicas, operativas y de seguridad.

## Identidad legal y privacidad

| Dato | Decisión | Estado |
| --- | --- | --- |
| Entidad legal operadora | Pendiente | **Bloquea datos reales: S1-LEGAL01** |
| Dirección oficial | Colima de Tibás, San José, Costa Rica | Requiere confirmar que es la dirección legal oficial |
| Contacto de privacidad | Pendiente | **Bloquea datos reales: S1-LEGAL01** |
| Asesoría legal calificada | Pendiente | **Bloquea datos reales: S1-LEGAL01** |
| Requisitos legales aplicables y proceso de aprobación | Pendiente de la aprobadora legal y la asesoría | **Bloquea datos reales: S1-LEGAL01** |

## Piloto, medición y criterios de parada

| Decisión | Estado |
| --- | --- |
| Participantes del piloto | Personal y personas invitadas; falta definir cantidad o grupo concreto |
| Duración del piloto | Pendiente |
| Metas medibles de éxito | Pendiente |
| Umbrales técnicos de pausa o rollback | Pendiente; Julio Zeledon fue nombrado como responsable, pero falta definir los umbrales |
| Umbral por volumen de soporte | Pendiente de Laura Vargas |
| Responsable de revisar resultados | Pendiente |
| Periodo de revisión | Pendiente |

## Presupuesto

- Yerlin Marquez es la patrocinadora ejecutiva y autoridad presupuestaria.
- Julio Zeledon fue indicado como autoridad de gasto.
- Se debe confirmar si Julio puede ejecutar gastos solamente dentro de un presupuesto previamente aprobado por Yerlin y definir el límite aplicable.

## Decisiones que todavía bloquean el piloto con datos reales

Por decisión posterior del product owner, estos asuntos no bloquean el desarrollo con datos sintéticos ni la demostración integral. Sí bloquean invitar clientes reales o abrir el registro público:

1. La entidad legal, el contacto de privacidad, la asesoría legal y el proceso de aprobación de S1-LEGAL01.
2. La duración y composición concreta del piloto de S1-G03.
3. Las metas medibles y los umbrales de pausa o rollback de S1-G04.
4. La distribución exacta de autoridad presupuestaria y gasto de S1-G05.
