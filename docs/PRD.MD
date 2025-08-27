# PRD – CotizAI (Cotizador Multimarca de Grupo Almatodo)

## Objetivo Estratégico
Crear una plataforma inteligente que permita a Compras y Ventas cargar, procesar y cotizar productos de múltiples marcas, con IA y automatización completa.

## Usuarios Finales
- Compras (Carga de listas de precios)
- Ventas (Generación y envío de cotizaciones)

## Funcionalidades Principales
- Login con Supabase Auth (rol: compras o ventas)
- Subida de archivos PDF/Excel
- Procesamiento con IA (GPT-4o o alternativa gratuita)
- Repositorio de costos estructurado por producto, marca y proveedor
- Generación de cotización con desglose: precio, utilidad, comisión
- Envío automático por WhatsApp/correo (n8n)
- Registro y dashboard básico de cotizaciones

## Herramientas e Integraciones
- Frontend: Next.js + Tailwind
- Backend: Node.js (integrado en Next.js)
- DB: Supabase (PostgreSQL + Auth)
- IA: GPT-4o vía API o n8n
- Automatización: n8n (en servidor propio)
- Hosting: Vercel
- Editor: Cursor

## Reglas de Negocio Clave
- Solo usuarios autenticados pueden subir cotizaciones.
- Las cotizaciones deben calcular IVA, utilidad y comisión automáticamente.
- Cada cotización debe quedar registrada con estatus y seguimiento.
- Feedback de no cierre se envía a Compras.

## Indicadores de Éxito
- 6 listas de precios cargadas sin error
- 15 cotizaciones generadas por el equipo
- Flujo completo de cotización < 5 minutos
- Precisión IA ≥ 85% en extracción de datos
