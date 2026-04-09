# Estado del Proyecto - EnsayoHub

**Última actualización: 2026-04-09**

---

## Progreso General

| Fase | Estado | Notas |
|------|--------|-------|
| Docs/Prompts | ✅ Completo | RFC, prompts agentes, ADR, SDD |
| Backend API | ✅ Completo | 15+ endpoints, Fastify + Drizzle |
| Frontend Components | ✅ Completo | React + Vite + TanStack Query |
| DB Setup | ✅ Completo | Neon PostgreSQL |
| Despliegue | ✅ Completo | Vercel + Render |
| Testing | ⏳ Pendiente | Pruebas manuales realizadas |

---

## URLs de Producción

| Servicio | URL | Estado |
|----------|-----|--------|
| Frontend | https://ensayoshub.vercel.app | ✅ Activo |
| Backend | https://ensayoshub.onrender.com | ✅ Activo (sleep mode) |
| DB | Neon PostgreSQL | ✅ Activo |

---

## Stack Tecnológico

```
Frontend:     React 19 + Vite 8 + TypeScript 6 + TanStack Query + TailwindCSS 4
Backend:      Node.js 22 + Fastify 5 + Drizzle ORM
DB:           Neon PostgreSQL
Auth:         JWT
Despliegue:   Vercel (frontend) + Render (backend)
```

---

## Ecosystem Stack (Basado en Gentle AI Stack)

```
┌─────────────────────────────────────────────────────────────┐
│                    ORQUESTADOR PRINCIPAL                    │
│                  (Vos / Humano)                             │
│  "Ustedes son orquestadores del orquestador"                │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    MEMORY.md (Engram)                       │
│  Decisiones, bugs, patrones, aprendizajes persistidos      │
└─────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    SDD Workflow                             │
│  explore → propose → specify → implement → verify → doc    │
└─────────────────────────────────────────────────────────────┘
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
┌──────────────────┐     ┌──────────────────┐
│   SUBAGENTE 1    │     │   SUBAGENTE 2     │
│   (Frontend)     │     │   (Backend)       │
│   3% contexto    │     │   3% contexto    │
└──────────────────┘     └──────────────────┘
```

---

## Funcionalidades Implementadas

### ✅ Autenticación
- Login/Logout con JWT
- Protección de rutas
- Roles: admin / collaborator

### ✅ Agenda
- Calendario con react-big-calendar
- Vistas: mes, semana, día
- Colores por estado de reserva

### ✅ Reservas (Bookings)
- Crear/editar/eliminar reservas
- Confirmar reservas (crea income)
- Completar reservas (con extra amount)
- Detección de tarifas especiales (viernes-sábado-domingo/feriados)

### ✅ Clientes
- CRUD completo
- Eliminación cascada de reservas
- Ver detalle de reservas por cliente

### ✅ Finanzas
- Ingresos (con linked a bookings)
- Gastos (con categorías, recurrencia)
- Estados: pending, paid, overdue

### ✅ Dashboard
- Métricas: occupancy, horas, ingresos, gastos, ganancias
- Períodos: semana, mes, año

### ✅ Tarifas
- Página de visualización de precios
- Tarifas diferenciadas por tipo de servicio y día

---

## Pre-commit Hook

El proyecto tiene configurado un hook de pre-commit que verifica:
1. **TypeScript** - `pnpm typecheck` (tsc --noEmit)
2. **ESLint** - `pnpm lint`

### Reglas ESLint activas:
- `@typescript-eslint/no-explicit-any` → error
- `@typescript-eslint/no-unused-vars` → error
- `no-console` → warning

### Para omitir el hook (emergencias):
```bash
git commit --no-verify -m "mensaje"
```

---

## Resolver Conflictos

### 1. Antes de hacer pull:
```bash
git fetch origin
git pull origin main --rebase
```

### 2. Si hay conflictos:
```bash
# Editar archivos en conflicto
git add archivos-resueltos
git rebase --continue
```

### 3. Si querés cancelar el rebase:
```bash
git rebase --abort
```

### 4. Tips para evitar conflictos:
- Hacer `git pull` frecuentemente
- Trabajar en branches separados para features grandes
- Commits pequeños y frecuentes
- Nunca fazer `git push --force` sobre main

---

## Scripts Disponibles

```bash
# Desarrollo local
cd backend && pnpm dev      # http://localhost:3001
cd frontend && pnpm dev     # http://localhost:5173

# Build
cd backend && pnpm build
cd frontend && pnpm build

# DB
cd backend && pnpm db:push   # Aplicar schema
cd backend && pnpm db:seed   # Poblar datos
```

---

## Variables de Entorno

### Backend (.env)
```
DATABASE_URL=postgresql://...@neon.tech/neondb
JWT_SECRET=...
PORT=3001
NODE_ENV=production
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001/api/v1
# En producción: VITE_API_URL=https://ensayoshub.onrender.com/api/v1
```

---

## Archivos Clave

| Archivo | Descripción |
|---------|-------------|
| `MEMORY.md` | Memoria persistente - decisiones, bugs, patrones |
| `DEPLOY.md` | Guía de despliegue a producción |
| `docs/ADR.md` | Architecture Decision Records |
| `docs/tasks/` | Tareas del proyecto |
| `frontend/vercel.json` | Config Vercel |
| `backend/render.yaml` | Config Render |
| `.git/hooks/pre-commit` | Hook de validación |

---

## Notas Importantes

1. **Render sleep mode**: El backend gratuito entra en "sleep" después de 15 min sin actividad. La primera request tardará ~30-60 seg en despertar.

2. **Vercel SPA**: El frontend usa React Router, configurado con `vercel.json` para servir `index.html` en todas las rutas.

3. **Neon DB**: La base de datos ya tiene seed de categorías y feriados.

---

## Próximos Pasos (Opcionales)

1. Testing automatizado (Vitest + Playwright)
2. Migración de datos desde Excel
3. Reportes exportables (CSV/PDF)
4. Mejoras de UI/UX
5. Notificaciones/email