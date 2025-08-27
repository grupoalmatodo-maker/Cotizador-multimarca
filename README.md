# 🚀 CotizAI - Sistema de Cotización Inteligente

**Cotizador Multimarca para Grupo Almatodo**

## 📋 Descripción del Proyecto

CotizAI es un sistema inteligente de cotización que permite a los equipos de ventas generar cotizaciones profesionales de manera rápida y eficiente, mientras mantiene la seguridad de los costos internos y automatiza el proceso de cálculo de precios, márgenes y comisiones.

## 🏗️ Arquitectura del Sistema

### **Stack Tecnológico**
- **Frontend**: Next.js 15 (App Router) + TypeScript + TailwindCSS
- **Backend**: Next.js Server Actions + API Routes
- **Base de Datos**: Supabase (PostgreSQL + Auth + RLS)
- **Autenticación**: Supabase Auth con roles personalizados
- **Hosting**: Vercel
- **Gestión de Paquetes**: pnpm

### **Roles del Sistema**
- **🛒 Compras**: Gestión de proveedores, productos y precios de compra
- **💰 Ventas**: Generación de cotizaciones y seguimiento de clientes
- **👑 Admin**: Control total del sistema y configuración

## 🚀 Instalación y Configuración

### **1. Prerrequisitos**
- Node.js 18+ 
- pnpm 8+
- Cuenta en [Supabase](https://supabase.com)
- Cuenta en [Vercel](https://vercel.com) (opcional)

### **2. Clonar y Configurar**
```bash
# Clonar el repositorio
git clone <tu-repositorio>
cd cotizai

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env.local
```

### **3. Configurar Variables de Entorno**
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
N8N_WEBHOOK_URL_INGEST=tu_webhook_n8n_ingesta
N8N_WEBHOOK_URL_SEND=tu_webhook_n8n_envio
N8N_WEBHOOK_SECRET=tu_secreto_n8n
```

### **4. Configurar Supabase**

#### **4.1 Habilitar Autenticación**
1. Ve a tu [Dashboard de Supabase](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **Authentication > Settings**
4. Habilita:
   - ✅ "Enable email confirmations"
   - ✅ "Enable email signups"
   - ✅ "Enable email signins"

#### **4.2 Ejecutar Migraciones**
```bash
# Conectar CLI de Supabase
supabase link --project-ref tu_project_ref

# Ejecutar migraciones
supabase db push

# Ejecutar semillas (opcional)
supabase db reset
```

### **5. Ejecutar el Proyecto**
```bash
# Desarrollo
pnpm dev

# Build de producción
pnpm build

# Iniciar producción
pnpm start
```

## 🗄️ Estructura de Base de Datos

### **Tablas Principales**
- **`profiles`**: Usuarios y roles del sistema
- **`suppliers`**: Proveedores de productos
- **`products`**: Catálogo de productos
- **`price_lists`**: Listas de precios subidas
- **`purchase_prices`**: Precios de compra por producto
- **`margin_rules`**: Reglas de margen por marca/zona
- **`commission_rules`**: Reglas de comisión por vendedor
- **`quotes`**: Cotizaciones generadas
- **`quote_items`**: Items de cada cotización
- **`feedback`**: Retroalimentación de cotizaciones

### **Seguridad (RLS)**
- **Ventas**: Solo ve sus cotizaciones, sin acceso a costos
- **Compras**: Acceso completo a precios y proveedores
- **Admin**: Control total del sistema

## 🔐 Autenticación y Autorización

### **Flujo de Login**
1. Usuario accede a `/login`
2. Se registra o inicia sesión
3. Se crea automáticamente un profile con rol 'ventas'
4. Redirección automática al dashboard correspondiente

### **Configurar Roles de Usuario**
```sql
-- Cambiar rol a 'compras'
SELECT set_user_role('gabino@tu-dominio.com', 'compras');

-- Cambiar rol a 'admin'
SELECT set_user_role('tu-admin@tu-dominio.com', 'admin');

-- Verificar roles
SELECT email, role FROM profiles ORDER BY role, email;
```

## 🎯 Funcionalidades del Sistema

### **Módulo de Compras** 🛒
- Carga de listas de precios (PDF/Excel)
- Gestión de proveedores y productos
- Configuración de precios de compra
- Seguimiento de costos por marca

### **Módulo de Ventas** 💰
- Generación de cotizaciones
- Cálculo automático de precios
- Aplicación de reglas de margen
- Seguimiento de estado de cotizaciones

### **Módulo de Administración** 👑
- Gestión de usuarios y roles
- Configuración de reglas de negocio
- Reportes y estadísticas
- Auditoría del sistema

## 🔄 Flujos de Trabajo

### **Flujo de Cotización**
1. **Ventas** selecciona productos y cantidades
2. Sistema calcula precio base según reglas de margen
3. Se aplica IVA y comisiones automáticamente
4. Se genera cotización con precio final
5. **Ventas** envía cotización al cliente
6. Seguimiento de estado (enviada, ganada, perdida)

### **Flujo de Carga de Precios**
1. **Compras** sube lista de precios (PDF/Excel)
2. Sistema procesa y extrae datos
3. Se actualizan precios de compra
4. **Ventas** puede generar cotizaciones con precios actualizados

## 🧪 Testing y Verificación

### **Verificar Instalación**
```bash
# Verificar TypeScript
pnpm typecheck

# Verificar linting
pnpm lint

# Verificar build
pnpm build

# Verificar base de datos
supabase db diff
```

### **Verificar Funcionalidades**
1. **Login/Registro**: Crear cuenta y verificar redirección
2. **Roles**: Verificar acceso según rol asignado
3. **RLS**: Confirmar que ventas no puede ver costos
4. **Navegación**: Verificar rutas protegidas

## 🚀 Despliegue

### **Vercel (Recomendado)**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel --prod
```

### **Variables de Entorno en Vercel**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL`
- `N8N_WEBHOOK_URL_INGEST`
- `N8N_WEBHOOK_URL_SEND`
- `N8N_WEBHOOK_SECRET`

## 📱 Estructura de Archivos

```
cotizai/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Rutas de autenticación
│   ├── (app)/             # Rutas protegidas de la aplicación
│   ├── api/               # API routes
│   └── globals.css        # Estilos globales
├── components/             # Componentes reutilizables
├── lib/                    # Utilidades y clientes
├── types/                  # Tipos TypeScript
├── supabase/               # Configuración y migraciones
│   ├── migrations/         # Migraciones de base de datos
│   ├── seed.sql           # Datos iniciales
│   └── config.toml        # Configuración de Supabase
└── README.md              # Este archivo
```

## 🐛 Solución de Problemas

### **Errores Comunes**

#### **Error de Cookies en Next.js 15+**
```bash
# Actualizar dependencias de Supabase
pnpm add @supabase/ssr@latest @supabase/supabase-js@latest
```

#### **Error de Build**
```bash
# Limpiar cache
rm -rf .next node_modules
pnpm install
pnpm build
```

#### **Error de Base de Datos**
```bash
# Resetear base de datos
supabase db reset

# Verificar conexión
supabase status
```

## 📚 Recursos Adicionales

- [Documentación de Supabase](https://supabase.com/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [TailwindCSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)

## 🤝 Contribución

### **Convención de Commits**
```
feat(scope): nueva funcionalidad
fix(scope): corrección de bug
chore(scope): tareas de mantenimiento
docs(scope): documentación
```

### **Flujo de Desarrollo**
1. Crear rama feature: `git checkout -b feat/nueva-funcionalidad`
2. Desarrollar y probar
3. Commit con convención: `git commit -m "feat(ventas): agregar calculadora de precios"`
4. Push y crear Pull Request

## 📞 Soporte

Para soporte técnico o preguntas sobre el proyecto:
- **Email**: [tu-email@dominio.com]
- **Documentación**: [link-a-docs]
- **Issues**: [link-a-github-issues]

## 📄 Licencia

Este proyecto es propiedad de **Grupo Almatodo** y está destinado para uso interno.

---

**¡CotizAI - Transformando la forma de cotizar! 🚀**
