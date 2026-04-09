# EnsayoHub - Memoria Persistente (Engram)
## Última actualización: 2026-04-09

---

## Decisiones de Arquitectura

### Stack
- Frontend: React 19 + Vite 8 + TypeScript 6
- Backend: Node.js 22 + Fastify 5
- DB: Supabase PostgreSQL + Drizzle ORM
- Auth: JWT via Fastify JWT
- Estado: TanStack Query

### Patrones Adoptados
- Capas: routes → services → repositories (pendiente refactor)
- Errores: AppError class con statusCode
- Validación: Zod 4 (z.email(), z.uuid())
- Money: String para evitar floating point

### NO adoptado (postergado)
- shadcn/ui (requiere CLI interactivo)
- Services layer (código en routes por simplicidad)
- RLS en Supabase

---

## Bugs Conocidos

| Fecha | Bug | Solución | Estado |
|-------|-----|----------|--------|
| 2026-04-09 | ECONNREFUSED 127.0.0.1:5432 al hacer login | Agregar `import 'dotenv/config'` en db.ts | ✅ Solucionado |
| 2026-04-09 | Frontend puerto 5173 ocupado | Usar puerto 5174 | Conocido |

---

## Patrones Exitosos

### Backend
```typescript
// Error handling
throw errors.notFound('Booking');

// Zod validation
z.email()  // NO z.string().email()

// Drizzle query
db.query.bookings.findFirst({ where, with })
```

### Frontend
```typescript
// TanStack Query hook
useQuery({
  queryKey: ['entity', id],
  queryFn: () => api.entity.get(id),
  enabled: !!id,
});
```

---

## Aprendiendo del Proyecto

### Qué funcionó
- Setup rápido con pnpm
- Ollama local para código repetitivo
- Documentar decisiones en ADR.md

### Qué mejorar
- Agentes no generaron código usable directamente (necesitó refinamiento)
- Scripts de extracción de código complejos
- Falta testing desde el inicio

---

## Contexto para Próximas Sesiones

1. Backend completo conectando a Neon (no Supabase)
2. Frontend corriendo en puerto 5174
3. Pendiente: migración de datos desde Excel (manual)
4. Scripts de limpieza hechos: scripts/clean.ts
5. Fix aplicado: dotenv en db.ts

---

## Para Buscar

Buscar por tema:
- `decisiones`: Arquitectura y stack
- `bugs`: Problemas conocidos
- `patrones`: Código reutilizable
- `aprender`: Lecciones del proyecto
