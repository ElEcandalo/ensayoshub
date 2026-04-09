# Próxima Sesión - EnsayoHub

## Contexto Actual

**Stack:**
- Frontend: React 19 + Vite 8 + TypeScript 6 + TanStack Query + TailwindCSS 4
- Backend: Node.js 22 + Fastify 5 + Drizzle ORM
- DB: Neon PostgreSQL (no Supabase)
- Auth: JWT

**Puertos:**
- Backend: `http://localhost:3001`
- Frontend: `http://localhost:5174` (o 5175)

---

## Bugs Conocidos

| Bug | Estado | Notas |
|-----|--------|-------|
| Error 500 al hacer GET /bookings con fecha | ✅ Corregido | Convertido a string ISO |
| Error al crear booking: `value.toISOString is not a function` | ❌ Pendiente | Drizzle no acepta Date objects |

---

## Tareas Pendientes del MVP

1. **Reservas recurrentes (múltiples fechas)**
   - Frontend: ✅ Completado (checkbox + selector de fechas)
   - Backend: ❌ Error con timestamps - necesita fix en `routes/bookings.ts`

2. **Migración de datos desde Excel**
   - Archivo: `C:\Users\Usuario\Downloads\Escandalo 2026.xlsx`
   - Datos: Enero - Mayo 2026

3. **Reportes exportables (CSV/PDF)** - No iniciado

---

## Scripts Útiles

```bash
# Backend
cd backend && pnpm dev

# Frontend
cd frontend && pnpm dev
```

---

## Próximo Paso

**Fix bug create booking** en `backend/src/routes/bookings.ts` línea ~100:

Cambiar de:
```typescript
startTime: startDateTime,
endTime: endDateTime,
```

A:
```typescript
startTime: startDateTime.toISOString(),
endTime: endDateTime.toISOString(),
```

---

## Archivos Clave

- `backend/src/routes/bookings.ts` - ENDPOINT CON BUG
- `frontend/src/components/booking/BookingModal.tsx`
- `docs/tasks/08-migration.md`