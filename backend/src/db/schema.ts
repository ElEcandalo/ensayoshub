import { pgTable, pgEnum, uuid, varchar, text, timestamp, date, integer, decimal, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const userRoleEnum = pgEnum('user_role', ['admin', 'collaborator']);
export const bookingStatusEnum = pgEnum('booking_status', ['pending', 'confirmed', 'completed', 'cancelled']);
export const serviceTypeEnum = pgEnum('service_type', ['rehearsal', 'class']);
export const expenseRecurrenceEnum = pgEnum('expense_recurrence', ['none', 'weekly', 'monthly', 'yearly']);
export const expensePaymentStatusEnum = pgEnum('expense_payment_status', ['pending', 'paid', 'overdue']);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }),
  name: varchar('name', { length: 255 }).notNull(),
  role: userRoleEnum('role').default('admin'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const clients = pgTable('clients', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  notes: text('notes'),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const availability = pgTable('availability', {
  id: uuid('id').primaryKey().defaultRandom(),
  dayOfWeek: integer('day_of_week').notNull(),
  startHour: integer('start_hour').notNull(),
  endHour: integer('end_hour').notNull(),
  isActive: boolean('is_active').default(true),
});

export const holidays = pgTable('holidays', {
  id: uuid('id').primaryKey().defaultRandom(),
  date: date('date').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  year: integer('year').notNull(),
  source: varchar('source', { length: 50 }).default('manual'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const bookings = pgTable('bookings', {
  id: uuid('id').primaryKey().defaultRandom(),
  clientId: uuid('client_id').references(() => clients.id).notNull(),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  actualEndTime: timestamp('actual_end_time'),
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

export const incomes = pgTable('incomes', {
  id: uuid('id').primaryKey().defaultRandom(),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  bookingId: uuid('booking_id').references(() => bookings.id),
  description: varchar('description', { length: 500 }),
  date: date('date').notNull(),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 20 }).notNull(),
  isDefault: boolean('is_default').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const expenses = pgTable('expenses', {
  id: uuid('id').primaryKey().defaultRandom(),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  categoryId: uuid('category_id').references(() => categories.id),
  description: varchar('description', { length: 500 }),
  dueDate: date('due_date').notNull(),
  paymentDate: date('payment_date'),
  paymentStatus: expensePaymentStatusEnum('payment_status').default('pending'),
  recurrenceType: expenseRecurrenceEnum('recurrence_type').default('none'),
  receiptUrl: varchar('receipt_url', { length: 500 }),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  createdClients: many(clients),
  createdBookings: many(bookings),
  createdIncomes: many(incomes),
  createdExpenses: many(expenses),
}));

export const clientsRelations = relations(clients, ({ one, many }) => ({
  createdBy: one(users, { fields: [clients.createdBy], references: [users.id] }),
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  client: one(clients, { fields: [bookings.clientId], references: [clients.id] }),
  createdBy: one(users, { fields: [bookings.createdBy], references: [users.id] }),
  income: one(incomes),
}));

export const incomesRelations = relations(incomes, ({ one }) => ({
  booking: one(bookings, { fields: [incomes.bookingId], references: [bookings.id] }),
  createdBy: one(users, { fields: [incomes.createdBy], references: [users.id] }),
}));

export const expensesRelations = relations(expenses, ({ one }) => ({
  category: one(categories, { fields: [expenses.categoryId], references: [categories.id] }),
  createdBy: one(users, { fields: [expenses.createdBy], references: [users.id] }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  expenses: many(expenses),
}));
