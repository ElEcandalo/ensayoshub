# EnsayoHub

Sistema de gestión de espacio de ensayos musicales.

## 🚀 Estado

**Producción:**  
- Frontend: https://ensayoshub.vercel.app  
- Backend: https://ensayoshub.onrender.com

## 🛠️ Stack

| Capa | Tecnología |
|------|-------------|
| Frontend | React 19 + Vite 8 + TypeScript 6 + TanStack Query + TailwindCSS 4 |
| Backend | Node.js 22 + Fastify 5 + Drizzle ORM |
| DB | Neon PostgreSQL |
| Auth | JWT |
| Deploy | Vercel + Render |

## 📋 Funcionalidades

- ✅ Autenticación (login/logout)
- ✅ Agenda con calendario (react-big-calendar)
- ✅ Gestión de reservas (crear, editar, eliminar, confirmar, completar)
- ✅ Gestión de clientes (CRUD, ver reservas por cliente)
- ✅ Finanzas: Ingresos y Gastos
- ✅ Dashboard con métricas
- ✅ Página de Tarifas

## 🏃‍♂️ Inicio Rápido

```bash
# Clonar
git clone https://github.com/ElEcandalo/ensayoshub.git
cd ensayoshub

# Instalar
cd backend && pnpm install
cd ../frontend && pnpm install

# Desarrollo
# Terminal 1:
cd backend && pnpm dev  # http://localhost:3001
# Terminal 2:
cd frontend && pnpm dev  # http://localhost:5173
```

## 🔧 Comandos

```bash
# Backend
pnpm dev        # Servidor de desarrollo
pnpm build      # Build producción
pnpm db:push   # Aplicar schema a DB
pnpm db:seed   # Poblar datos iniciales

# Frontend
pnpm dev       # Servidor de desarrollo
pnpm build     # Build producción
pnpm typecheck # Verificar TypeScript
pnpm lint      # Verificar ESLint
```

## 🔨 Pre-commit

El proyecto tiene un hook de pre-commit que corre:
1. `pnpm typecheck` - Verifica TypeScript
2. `pnpm lint` - Verifica ESLint

Para hacer commit sin el hook:
```bash
git commit --no-verify -m "mensaje"
```

## 📁 Estructura

```
ensayohub/
├── backend/          # API Fastify + Drizzle
├── frontend/        # React + Vite
├── docs/            # Documentación
├── DEPLOY.md        # Guía de despliegue
├── PROJECT_STATE.md # Estado del proyecto
└── MEMORY.md        # Decisiones y patrones
```

## 🔑 Credenciales

- Email: `admin@ensayohub.com`
- Password: `Admin123!`

## 📄 Licencia

MIT