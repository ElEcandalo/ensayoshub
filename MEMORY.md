# EnsayoHub - Memoria Persistente (Engram)

**Última actualización: 2026-04-09**

---

## Decisiones de Arquitectura

### Stack Final
- Frontend: React 19 + Vite 8 + TypeScript 6
- Backend: Node.js 22 + Fastify 5
- DB: Neon PostgreSQL + Drizzle ORM
- Auth: JWT via Fastify JWT
- Estado: TanStack Query
- CSS: TailwindCSS 4

### Patrones Adoptados
- Capas: routes → services → repositories (simplificado, código en routes)
- Errores: AppError class con statusCode
- Validación: Zod 4 (z.email(), z.uuid())
- Money: String para evitar floating point
- TypeScript: `verbatimModuleSyntax` habilitado

### NO adoptado
- shadcn/ui
- RLS en Supabase/Neon

---

## Errores de TypeScript Resueltos

| Fecha | Error | Solución |
|-------|-------|----------|
| 2026-04-09 | `baseUrl` deprecated TS 7.0 | Agregar `ignoreDeprecations: "6.0"` en tsconfig |
| 2026-04-09 | `request.user?.id` type conflict | Usar casting: `(request.user as AuthUser \| undefined)?.id` |
| 2026-04-09 | Drizzle insert clientId error | Usar casting `as any` en valores de insert |
| 2026-04-09 | `ReactNode` type-only import | Usar `import type { ReactNode }` |
| 2026-04-09 | Recurrence type mismatch | Definir tipo explícito `type RecurrenceType = 'none' \| 'weekly' \| 'monthly' \| 'yearly'` |

---

## Bugs Conocidos

| Fecha | Bug | Solución | Estado |
|-------|-----|----------|--------|
| 2026-04-09 | ECONNREFUSED 127.0.0.1:5432 | Agregar `import 'dotenv/config'` en db.ts | ✅ Solucionado |
| 2026-04-09 | Frontend puerto 5173 ocupado | Usar puerto 5174 | Conocido |
| 2026-04-09 | Vercel 404 en rutas SPA | Agregar rewrites en vercel.json | ✅ Solucionado |
| 2026-04-09 | Render deploy TypeScript errors | Corregir tipos, exports, imports | ✅ Solucionado |

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

// User type en request
const user = request.user as AuthUser | undefined;
const userId = user?.id;
```

### Frontend
```typescript
// TanStack Query hook
useQuery({
  queryKey: ['entity', id],
  queryFn: () => api.entity.get(id),
  enabled: !!id,
});

// Type-only import para TS 6+
import type { ReactNode } from 'react';
import type { Booking, Client } from '@/lib/api';
```

### Vercel SPA
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## Lecciones Aprendidas

1. **TypeScript + Vite + Vercel**: Verificar build local antes de push
2. **ESLint con typed linting**: Requiere configuración adicional, mejor no usarlo
3. **Pre-commit hooks**: Imprescindibles para evitar errores en deploy
4. **Render sleep mode**: Esperar 30-60s en primera request
5. **Vercel SPA**: Rewrites son necesarios para React Router

---

## Para Continuar

1. Testing automatizado (pendiente)
2. Migración de datos desde Excel (pendiente)
3. Reportes exportables (pendiente)

---

## Recursos

- Video referencia: [Gentle AI Stack](https://www.youtube.com/watch?v=UoS_LP-PCG8)
- Docs Vercel SPA: https://vercel.com/docs/frameworks/frontend
- Docs Drizzle: https://orm.drizzle.team