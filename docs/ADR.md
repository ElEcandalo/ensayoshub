# Decisiones de Arquitectura - EnsayoHub
## 2026-04-09

---

## 1. Stack Tecnológico

### Justificación de cada elección

| Tecnología | Decisión | Alternativa | Razón |
|------------|----------|-------------|-------|
| **React 19** | ✅ Elegido | Vue, Svelte | Ecosistema maduro, mejor soporte de agentes |
| **Vite 8** | ✅ Elegido | Webpack | Más rápido, mejor DX |
| **TypeScript 6** | ✅ Elegido | JS | Type safety, mejor para agentes |
| **TailwindCSS 4** | ✅ Elegido | CSS modules | Rápido, consistente, fácil de aprender |
| **shadcn/ui** | ⚠️ No instalado | Chakra, MUI | Requiere CLI interactivo, postergado |
| **TanStack Query** | ✅ Elegido | SWR, Redux | Mejor caching, mutations, DevTools |
| **Fastify 5** | ✅ Elegido | Express | 30% más rápido, mejor TypeScript |
| **Drizzle ORM** | ✅ Elegido | Prisma | Type-safe, SQL-like, migraciones simples |
| **Supabase** | ✅ Elegido ( Neon, no Supabase) | AWS RDS | Gratis tier inicial, Auth incluido, mejor soporte IPv4 |
| **Zod 4** | ✅ Elegido | Yup, Joi | Type inference, activa migración a v4 |

---

## 2. Arquitectura de Capas

### Backend (Node.js + Fastify)

```
backend/src/
├── index.ts              # Entry point, plugins, routes
├── routes/              # Controladores HTTP (薄)
├── services/            # Lógica de negocio (pendiente)
├── schemas/             # Zod validations (inline en routes)
├── middleware/           # Auth, error handling
├── lib/                 # DB, utilities
└── db/
    ├── schema.ts        # Drizzle schema
    ├── migrations/      # Migraciones
    └── seeds/           # Datos iniciales
```

**Decisión:** No usamos servicios separados todavía. La lógica de negocio está en las rutas por simplicidad. Se migrará a servicios cuando crezca.

### Frontend (React)

```
frontend/src/
├── components/
│   ├── ui/              # Base components (pendiente)
│   ├── booking/         # Componentes de reservas
│   ├── finance/         # Componentes financieros
│   └── dashboard/       # Widgets
├── pages/               # Route components
├── hooks/               # Custom hooks (pendiente)
├── lib/                 # API client, utils, tariffs
└── types/               # Shared types (en api.ts)
```

---

## 3. Patrones de Código

### Backend

#### Error Handling
```typescript
// Custom error class
class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string
  ) {}
}

// Usage
throw errors.notFound('Booking');
```

#### Validación con Zod 4
```typescript
// ❌ Old (Zod 3)
z.string().email()
z.string().uuid()

// ✅ New (Zod 4)
z.email()
z.uuid()
```

#### Repository Pattern
```typescript
// Drizzle query methods en schema
const booking = await db.query.bookings.findFirst({
  where: eq(bookings.id, id),
  with: { client: true },
});
```

### Frontend

#### API Client
```typescript
// Centralizado en lib/api.ts
export const apiClient = {
  bookings: {
    list: (params) => api.get('/bookings', params),
    create: (data) => api.post('/bookings', data),
    // ...
  },
};
```

#### Tipos Compartidos
```typescript
// Types exportados desde api.ts
export type Booking = { ... };
export type CreateBookingInput = { ... };
```

---

## 4. API Design

### Convenciones

| Aspecto | Decisión |
|---------|----------|
| **Base URL** | `/api/v1` |
| **Auth** | JWT en header `Authorization: Bearer <token>` |
| **Errors** | `{ error: string, code?: string }` |
| **Dates** | ISO 8601 strings |
| **Money** | String (evitar floating point) |
| **IDs** | UUID v4 |

### Endpoints

**Pattern:**
- `GET /resource` - Lista (con filtros query)
- `GET /resource/:id` - Detalle
- `POST /resource` - Crear
- `PATCH /resource/:id` - Editar parcial
- `DELETE /resource/:id` - Eliminar

**Special:**
- `POST /bookings/:id/confirm` - Acción especial
- `POST /bookings/:id/complete` - Acción especial
- `GET /bookings/check-availability` - Query especial

---

## 5. Autenticación y Autorización

### Roles

| Rol | Permisos |
|-----|----------|
| `admin` | Todo |
| `collaborator` | Bookings, Clients (no finances) |

### Middleware

```typescript
// requireAuth - Verifica JWT
// requireAdmin - Verifica rol admin
```

### RLS (Row Level Security)

Futuro: Supabase RLS para seguridad adicional.

---

## 6. Modelo de Datos

### Entidades Principales

```
users ─────────┬───────── clients
               │
               └──── bookings ──── incomes
                                 │
               ┌─────────────────┘
holidays ──────┴──── expenses ──── categories
               │
availability ──┘
```

### Decisiones de Schema

| Campo | Tipo | Razón |
|-------|------|-------|
| `id` | `uuid` |分散，没有冲突 |
| `amount` | `decimal` como string | Evitar floating point |
| `dates` | `timestamp` | Para timezone awareness |
| `status` | `enum` | Validación a nivel DB |
| `recurrenceType` | `enum` | Estándar |

---

## 7. Reglas de Negocio

### Tarifas (Hardcodeadas)

```typescript
const TARIFFS = {
  rehearsal: { weekday: 17000, weekend_holiday: 18000 },
  class: { weekday: 19000, weekend_holiday: 20000 },
};
```

### Estados de Reserva

```
pending → confirmed → completed
    ↓          ↓
cancelled   cancelled
```

**Flujo:**
1. `pending`: Cliente consultó
2. `confirmed`: Pagó seña (genera Income)
3. `completed`: Usó el servicio
4. `cancelled`: Cancelada

### Excedente Horario

| Minutos excedido | Cargo |
|------------------|-------|
| 0-15 | 0 (grace period) |
| 16-45 | 30 min a tarifa normal |
| 46+ | 1 hora a tarifa feriados |

---

## 8. Configuración de Entorno

### Variables Requeridas

**Backend:**
```env
DATABASE_URL=postgresql://...
JWT_SECRET=...
PORT=3001
```

**Frontend:**
```env
VITE_API_URL=http://localhost:3001
```

### Desarrollo vs Producción

| Aspecto | Dev | Prod |
|---------|-----|------|
| DB | Local o Supabase Dev | Supabase Pro |
| CORS | `origin: true` | Dominio específico |
| Logs | `pino-pretty` | JSON structured |
| Auth | JWT hardcoded | En variables |

---

## 9. Performance

### Frontend
- TanStack Query: Stale time 5 min
- Lazy loading de rutas
- Skeletons para loading states

### Backend
- Índices en queries frecuentes
- Pagination cuando aplique (pendiente)
- Connection pooling via Supabase

---

## 10. Testing (Pendiente)

### Estrategia

| Tipo | Herramienta | Cobertura objetivo |
|------|-------------|-------------------|
| Unit | Vitest | Services, utils |
| Integration | Supertest | API endpoints |
| E2E | Playwright | Flows críticos |

---

## 11. Despliegue (Futuro)

### Plan
1. Frontend: Vercel / Netlify
2. Backend: Railway / Render
3. DB: Supabase (migrar a Pro cuando crezca)

### CI/CD (Pendiente)
- GitHub Actions para tests
- Deploy automático en main
