# RFC 2 — ARQUITECTURA Y TECNOLOGÍA
## EnsayoHub
---
## 1. Arquitectura General
```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│                   React 19 + Vite 6 + TypeScript            │
│                   TailwindCSS + shadcn/ui                   │
│                   TanStack Query                            │
│                   React Hook Form + Zod                     │
│                   React Big Calendar (agenda)              │
│                   Recharts (dashboard)                     │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTPS (REST API)
┌─────────────────────▼───────────────────────────────────────┐
│                        BACKEND                               │
│                   Node.js 22 + Fastify 5                    │
│                   Drizzle ORM                               │
│                   Zod (validation)                          │
│                   JWT Auth (via Supabase)                  │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                    DATABASE                                  │
│                   Supabase (PostgreSQL 16)                   │
│                   Row Level Security                        │
│                   Storage (comprobantes)                     │
└─────────────────────────────────────────────────────────────┘
```
### Decisiones de arquitectura
| Decisión | Justificación |
|----------|---------------|
| Fastify | 30% más rápido que Express, mejor TypeScript nativo |
| Supabase | Postgres gestionado, Auth + RLS incluidos, $0 en tier gratuito |
| React Big Calendar | UI de agenda probada, soporte para vistas día/semana/mes |
| Drizzle | Type-safe, SQL-like, migraciones simples |
---
## 2. Stack Tecnológico
### Frontend
- react@19 + vite@6 + typescript@5
- tailwindcss@4 + shadcn/ui
- @tanstack/react-query@5
- react-router-dom@7
- react-big-calendar@1
- recharts@2
- zod + react-hook-form
- date-fns@3
- xlsx (lectura Excel)
### Backend
- node@22 + fastify@5
- drizzle-orm + drizzle-kit
- @fastify/cors + @fastify/jwt
- zod
### Database & Infra
- Supabase (PostgreSQL 16)
  - Auth (email/password)
  - Database
  - Storage (comprobantes de gastos)
---
## 3. Modelo de Datos
### Schema Drizzle - Entities
```typescript
// src/db/schema.ts
import { pgTable, pgEnum, uuid, varchar, text, timestamp, date, integer, decimal, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ENUMS
export const userRoleEnum = pgEnum('user_role', ['admin', 'collaborator']);
export const bookingStatusEnum = pgEnum('booking_status', ['pending', 'confirmed', 'completed', 'cancelled']);
export const serviceTypeEnum = pgEnum('service_type', ['rehearsal', 'class']);
export const expenseRecurrenceEnum = pgEnum('expense_recurrence', ['none', 'weekly', 'monthly', 'yearly']);
export const expensePaymentStatusEnum = pgEnum('expense_payment_status', ['pending', 'paid', 'overdue']);

// USERS (Admin y Colaboradoras)
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }),
  name: varchar('name', { length: 255 }).notNull(),
  role: userRoleEnum('role').default('admin'),
  createdAt: timestamp('created_at').defaultNow(),
});

// CLIENTES
export const clients = pgTable('clients', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  notes: text('notes'),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

// AVAILABILITY (Horarios del espacio)
export const availability = pgTable('availability', {
  id: uuid('id').primaryKey().defaultRandom(),
  dayOfWeek: integer('day_of_week').notNull(), // 0=Domingo, 6=Sábado
  startHour: integer('start_hour').notNull(), // 0-23
  endHour: integer('end_hour').notNull(),      // 0-23
  isActive: boolean('is_active').default(true),
});

// HOLIDAYS (Feriados Argentina)
export const holidays = pgTable('holidays', {
  id: uuid('id').primaryKey().defaultRandom(),
  date: date('date').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  year: integer('year').notNull(),
  source: varchar('source', { length: 50 }).default('manual'), // 'api', 'manual'
  createdAt: timestamp('created_at').defaultNow(),
});

// BOOKINGS (Reservas)
export const bookings = pgTable('bookings', {
  id: uuid('id').primaryKey().defaultRandom(),
  clientId: uuid('client_id').references(() => clients.id).notNull(),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  actualEndTime: timestamp('actual_end_time'),          // Hora real de salida
  serviceType: serviceTypeEnum('service_type').default('rehearsal'),
  status: bookingStatusEnum('status').default('pending'),
  isHolidayRate: boolean('is_holiday_rate').default(false),
  baseAmount: decimal('base_amount', { precision: 12, scale: 2 }).notNull(),
  extraAmount: decimal('extra_amount', { precision: 12, scale: 2 }).default('0'),
  notes: text('notes'),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// INCOMES (Ingresos)
export const incomes = pgTable('incomes', {
  id: uuid('id').primaryKey().defaultRandom(),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  bookingId: uuid('booking_id').references(() => bookings.id),
  description: varchar('description', { length: 500 }),
  date: date('date').notNull(),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

// CATEGORIES
export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 20 }).notNull(), // 'income' | 'expense'
  isDefault: boolean('is_default').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// EXPENSES (Gastos)
export const expenses = pgTable('expenses', {
  id: uuid('id').primaryKey().defaultRandom(),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  categoryId: uuid('category_id').references(() => categories.id),
  description: varchar('description', { length: 500 }),
  dueDate: date('due_date').notNull(),       // Fecha de vencimiento
  paymentDate: date('payment_date'),         // Fecha de pago (null si impago)
  paymentStatus: expensePaymentStatusEnum('payment_status').default('pending'),
  recurrenceType: expenseRecurrenceEnum('recurrence_type').default('none'),
  receiptUrl: varchar('receipt_url', { length: 500 }),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```
### Índices
```sql
CREATE INDEX idx_bookings_client ON bookings(client_id);
CREATE INDEX idx_bookings_time ON bookings(start_time, end_time);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_incomes_date ON incomes(date);
CREATE INDEX idx_incomes_booking ON incomes(booking_id);
CREATE INDEX idx_expenses_due_date ON expenses(due_date);
CREATE INDEX idx_expenses_payment_date ON expenses(payment_date);
CREATE INDEX idx_expenses_status ON expenses(payment_status);
CREATE INDEX idx_holidays_date ON holidays(date);
```
### Seed Categories
```typescript
// src/db/seeds/categories.ts
export const defaultCategories = [
  // Ingresos
  { name: 'Alquiler Sala', type: 'income' },
  { name: 'Clase Particular', type: 'income' },
  { name: 'Evento', type: 'income' },
  { name: 'Otro Ingreso', type: 'income' },
  
  // Gastos
  { name: 'Servicios (Luz/Internet)', type: 'expense' },
  { name: 'Limpieza', type: 'expense' },
  { name: 'Mantenimiento', type: 'expense' },
  { name: 'Sonido', type: 'expense' },
  { name: 'Insumos', type: 'expense' },
  { name: 'Honorarios', type: 'expense' },
  { name: 'Otro Gasto', type: 'expense' },
];
```
---
## 4. API Design
### Endpoints
```
Base URL: /api/v1

AUTH
  POST   /auth/login
  POST   /auth/register
  GET    /auth/me
  PATCH  /auth/me

BOOKINGS
  GET    /bookings              # Lista (filtros: startDate, endDate, clientId, status)
  GET    /bookings/:id
  POST   /bookings              # Crear (soporta múltiples fechas si recurrente)
  PATCH  /bookings/:id          # Editar
  DELETE /bookings/:id          # Cancelar (soft delete)
  POST   /bookings/:id/confirm  # Cambiar pending → confirmed (registra income)
  POST   /bookings/:id/complete # Marcar completed (con actualEndTime opcional)
  GET    /bookings/check-availability # Check overlap antes de crear

CLIENTS
  GET    /clients
  GET    /clients/:id
  POST   /clients
  PATCH  /clients/:id
  DELETE /clients/:id

FINANCES /incomes
  GET    /incomes              # Filtros: date range
  POST   /incomes              # Ingreso manual
  PATCH  /incomes/:id
  DELETE /incomes/:id

FINANCES /expenses
  GET    /expenses             # Filtros: dueDate range, paymentStatus
  POST   /expenses
  PATCH  /expenses/:id
  DELETE /expenses/:id

CATEGORIES
  GET    /categories
  POST   /categories           # Admin only
  PATCH  /categories/:id       # Admin only

AVAILABILITY
  GET    /availability
  PUT    /availability         # Reemplazar config completa

HOLIDAYS
  GET    /holidays             # Filtros: year
  POST   /holidays/sync        # Sync desde API Argentina
  POST   /holidays             # Agregar manual

DASHBOARD
  GET    /dashboard/metrics    # KPIs principales

REPORTS
  POST   /reports/generate
  GET    /reports/:id/download
```
### Ejemplos de Requests
```typescript
// POST /bookings (reserva individual)
{
  "clientId": "uuid-xxx",
  "dates": ["2024-03-15"],
  "startTime": "14:00",
  "endTime": "16:00",
  "serviceType": "rehearsal"
}

// POST /bookings/:id/confirm
{
  "amount": 34000,
  "date": "2024-03-10"
}

// POST /bookings/:id/complete
{
  "actualEndTime": "2024-03-15T17:30:00Z",
  "extraAmount": 18000,
  "recordExcess": true
}

// POST /expenses
{
  "amount": 15000,
  "categoryId": "uuid-cat",
  "description": "Limpieza mensual",
  "dueDate": "2024-04-01",
  "recurrenceType": "monthly"
}
```
### Response: Dashboard Metrics
```json
{
  "period": {
    "start": "2024-03-01",
    "end": "2024-03-31"
  },
  "metrics": {
    "occupancyRate": 0.68,
    "totalHoursBooked": 142,
    "totalHoursAvailable": 208,
    "totalIncomes": 1250000.00,
    "totalExpenses": 450000.00,
    "netProfit": 800000.00,
    "pendingExpenses": 85000.00,
    "averagePerBooking": 44642.86,
    "totalBookings": 28,
    "completedBookings": 26,
    "cancelledBookings": 2
  },
  "comparison": {
    "vsLastPeriod": {
      "incomes": 0.125,
      "expenses": -0.03,
      "occupancy": -0.032
    }
  }
}
```
---
## 5. Autenticación y Permisos
### Roles
| Rol | Permisos |
|-----|----------|
| admin | CRUD total, finanzas, dashboard, reportes, categorías |
| collaborator | CRUD bookings, ver agenda y clientes, NO finanzas |
### Row Level Security
```sql
-- Incomes y Expenses: solo admins
CREATE POLICY "Finances: admin only"
ON incomes FOR ALL
USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);

CREATE POLICY "Expenses: admin only"
ON expenses FOR ALL
USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);

-- Bookings: admins y collaborators
CREATE POLICY "Bookings: team access"
ON bookings FOR SELECT
USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'collaborator'))
);
```
---
## 6. Lógica de Negocio Clave
### Tarifa por defecto según día
```typescript
// src/lib/tariffs.ts
const TARIFFS = {
  rehearsal: {
    weekday: 17000,
    weekend_holiday: 18000,
  },
  class: {
    weekday: 19000,
    weekend_holiday: 20000,
  },
} as const;

export function getTariff(serviceType: 'rehearsal' | 'class', isWeekendOrHoliday: boolean): number {
  const tariffs = TARIFFS[serviceType];
  return isWeekendOrHoliday ? tariffs.weekend_holiday : tariffs.weekday;
}
```
### Detectar excedente y calcular extra
```typescript
// src/lib/booking.ts
interface ExcessResult {
  extraMinutes: number;
  extraAmount: number;
  applyWeekendRate: boolean;
}

export function calculateExcess(
  scheduledEnd: Date,
  actualEnd: Date,
  serviceType: 'rehearsal' | 'class'
): ExcessResult | null {
  const diffMs = actualEnd.getTime() - scheduledEnd.getTime();
  const extraMinutes = Math.floor(diffMs / 60000);
  
  if (extraMinutes <= 15) return null; // Dentro del grace period
  
  let extraAmount = 0;
  let applyWeekendRate = false;
  
  if (extraMinutes > 15 && extraMinutes <= 45) {
    extraAmount = getTariff(serviceType, false) / 2;
  } else if (extraMinutes > 45) {
    extraAmount = getTariff(serviceType, true);
    applyWeekendRate = true;
  }
  
  return { extraMinutes, extraAmount, applyWeekendRate };
}
```
---
## 7. Dashboard
### Widgets
- Ocupación: % de horas usadas vs disponibles
- Ingresos: Total facturado en el período
- Gastos: Total de gastos en el período
- Ganancia: Ingresos menos gastos
- Comparativa: ¿Fue mejor o peor que el mes pasado?
- Gastos pendientes: Lo que vence esta semana
### Agregaciones precalculadas
- Query de Ocupación semanal
- Totales por período
- Comparativas vs período anterior
- Gastos pendientes (próximos 7 días)
---
## 8. Reportes
| Tipo | Contenido |
|------|-----------|
| Resumen Mensual | Ingresos, gastos, net profit, ocupación |
| Detalle Reservas | Fecha, cliente, tipo, monto, estado |
| Gastos | Todos los gastos del período, categorizados |
---
## 9. Escalabilidad
### MVP (1-10 usuarios, 1 espacio)
- Supabase en tier gratuito
- Sin Redis ni cola de jobs
- Todo sincronizado
### V2 (10-50 usuarios, multi-espacio)
- Supabase Pro ($25/mes)
- Redis para cache y jobs
- Realtime para agenda en viva
---
## 10. Riesgos
| Riesgo |
|--------|
| Feriados desactualizados |
| Solapamiento de reservas |
| Consistencia booking/income |
| Performance con muchos datos |
