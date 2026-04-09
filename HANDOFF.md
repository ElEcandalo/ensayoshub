# HANDOFF - Sesión Anterior
## EnsayoHub - Para nueva sesión de IA

---

## 📋 RESUMEN EJECUTIVO

**Proyecto:** EnsayoHub - Sistema de gestión para espacio de ensayo y eventos
**Stack:** React 19 + Fastify 5 + Supabase PostgreSQL + Drizzle ORM
**Estado:** 90% codeado, falta configurar DB y probar

---

## 🎯 ÚLTIMO OBJETIVO

Configurar Supabase PostgreSQL y probar que todo funcione.

---

## 📁 ESTRUCTURA DEL PROYECTO

```
~/proyectos/ensayohub/
├── PROJECT_STATE.md     # Estado general (LEER PRIMERO)
├── MEMORY.md           # Memoria persistente (Engram)
├── docs/
│   ├── ADR.md          # Arquitectura decisions
│   ├── SDD.md          # Spec Driven Development workflow
│   ├── rfc/            # Requisitos originales
│   ├── prompts/        # Prompts para agentes
│   ├── tasks/          # 7 tareas pendientes
│   └── specs/          # Especificaciones (vacío)
├── frontend/           # 10 componentes React
└── backend/           # 14 archivos Node.js
```

---

## 🚀 COMANDOS PARA CONTINUAR

### 1. Setup DB (PRIMERO)
```bash
# Crear cuenta en supabase.com
# Copiar DATABASE_URL

cd ~/proyectos/ensayohub/backend
export DATABASE_URL='postgresql://postgres:TU_PASS@db.TU_ID.supabase.co:5432/postgres'
export PATH="$HOME/nodejs/bin:$PATH"

# Aplicar schema
pnpm db:push

# Poblar datos
pnpm db:seed

# Crear admin
pnpm tsx scripts/create-admin.ts admin@email.com password123 "Admin"
```

### 2. Probar
```bash
# Terminal 1: Backend
cd ~/proyectos/ensayohub/backend
pnpm dev  # http://localhost:3001

# Terminal 2: Frontend
cd ~/proyectos/ensayohub/frontend
pnpm dev  # http://localhost:5173
```

### 3. Scripts de Workflow
```bash
# Ver estado
~/scripts/ai-workflow.sh status

# Explorar y crear propuesta
~/scripts/ai-workflow.sh explore "nombre tarea"

# Memoria
~/scripts/ai-workflow.sh memory add "nota"
~/scripts/ai-workflow.sh memory search "texto"
```

---

## ✅ COMPLETADO

| Componente | Estado |
|-----------|--------|
| RFC Producto | ✅ |
| RFC Arquitectura | ✅ |
| ADR (decisiones) | ✅ |
| SDD Workflow | ✅ |
| MEMORY.md (Engram) | ✅ |
| Frontend (10 componentes) | ✅ |
| Backend (14 archivos) | ✅ |
| Auth + JWT | ✅ |
| Bookings CRUD | ✅ |
| Clients CRUD | ✅ |
| Finances CRUD | ✅ |
| Dashboard metrics | ✅ |

---

## ⏳ PENDIENTE

1. **Configurar Supabase** - Crear cuenta, obtener credenciales
2. **Aplicar schema** - `pnpm db:push`
3. **Crear admin inicial** - Primer usuario
4. **Testing manual** - Probar flujo completo
5. **Tests automatizados** - Vitest/Playwright (opcional V2)

---

## 🔑 VARIABLES DE ENTORNO NECESARIAS

```env
# Backend (.env)
DATABASE_URL=postgresql://postgres:PASS@host:5432/db
JWT_SECRET=un-secret-largo

# Frontend (.env)
VITE_API_URL=http://localhost:3001/api/v1
```

---

## 💡 PATRONES IMPORTANTES

```typescript
// Backend - Error handling
throw errors.notFound('Booking');

// Backend - Zod 4
z.email()  // NO z.string().email()

// Frontend - TanStack Query
useQuery({
  queryKey: ['entity', id],
  queryFn: () => api.entity.get(id),
  enabled: !!id,
});
```

---

## 📝 PARA AGREGAR A MEMORY

Si encontrás un bug o tomás una decisión importante:
```bash
~/scripts/ai-workflow.sh memory add "Descripción del aprendizaje"
```

---

## 🆘 SI TE PIERDES

1. Leer `PROJECT_STATE.md` para contexto
2. Leer `MEMORY.md` para decisiones previas
3. `~/scripts/ai-workflow.sh status` para ver estado
4. `git log` si hay git, para ver cambios recientes

---

**Última actualización:** 2026-04-09
**Siguiente paso:** Configurar Supabase y probar
