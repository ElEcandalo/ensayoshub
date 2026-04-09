import { db } from '../../lib/db.js';
import { holidays } from '../schema.js';

export const holidaysData = [
  // 2024
  { date: '2024-01-01', name: 'Año Nuevo', year: 2024 },
  { date: '2024-02-12', name: 'Carnaval', year: 2024 },
  { date: '2024-02-13', name: 'Carnaval', year: 2024 },
  { date: '2024-03-24', name: 'Día de la Memoria', year: 2024 },
  { date: '2024-03-29', name: 'Viernes Santo', year: 2024 },
  { date: '2024-04-02', name: 'Día del Veterano', year: 2024 },
  { date: '2024-05-01', name: 'Día del Trabajador', year: 2024 },
  { date: '2024-05-25', name: 'Día de la Revolución de Mayo', year: 2024 },
  { date: '2024-06-17', name: 'Paso a la Inmortalidad del Gral. Güemes', year: 2024 },
  { date: '2024-06-20', name: 'Día de la Bandera', year: 2024 },
  { date: '2024-07-09', name: 'Día de la Independencia', year: 2024 },
  { date: '2024-08-17', name: 'Paso a la Inmortalidad del Gral. San Martín', year: 2024 },
  { date: '2024-10-12', name: 'Día del Respeto a la Diversidad Cultural', year: 2024 },
  { date: '2024-11-18', name: 'Día de la Virgen de San Nicolás', year: 2024 },
  { date: '2024-12-08', name: 'Día de la Inmaculada Concepción', year: 2024 },
  { date: '2024-12-25', name: 'Navidad', year: 2024 },
  // 2025
  { date: '2025-01-01', name: 'Año Nuevo', year: 2025 },
  { date: '2025-03-03', name: 'Carnaval', year: 2025 },
  { date: '2025-03-04', name: 'Carnaval', year: 2025 },
  { date: '2025-03-24', name: 'Día de la Memoria', year: 2025 },
  { date: '2025-04-18', name: 'Viernes Santo', year: 2025 },
  { date: '2025-04-02', name: 'Día del Veterano', year: 2025 },
  { date: '2025-05-01', name: 'Día del Trabajador', year: 2025 },
  { date: '2025-05-25', name: 'Día de la Revolución de Mayo', year: 2025 },
  { date: '2025-06-16', name: 'Paso a la Inmortalidad del Gral. Güemes', year: 2025 },
  { date: '2025-06-20', name: 'Día de la Bandera', year: 2025 },
  { date: '2025-07-09', name: 'Día de la Independencia', year: 2025 },
  { date: '2025-08-17', name: 'Paso a la Inmortalidad del Gral. San Martín', year: 2025 },
  { date: '2025-10-12', name: 'Día del Respeto a la Diversidad Cultural', year: 2025 },
  { date: '2025-11-17', name: 'Día de la Virgen de San Nicolás', year: 2025 },
  { date: '2025-12-08', name: 'Día de la Inmaculada Concepción', year: 2025 },
  { date: '2025-12-25', name: 'Navidad', year: 2025 },
  // 2026
  { date: '2026-01-01', name: 'Año Nuevo', year: 2026 },
  { date: '2026-02-16', name: 'Carnaval', year: 2026 },
  { date: '2026-02-17', name: 'Carnaval', year: 2026 },
  { date: '2026-03-24', name: 'Día de la Memoria', year: 2026 },
  { date: '2026-04-03', name: 'Viernes Santo', year: 2026 },
  { date: '2026-04-02', name: 'Día del Veterano', year: 2026 },
  { date: '2026-05-01', name: 'Día del Trabajador', year: 2026 },
  { date: '2026-05-25', name: 'Día de la Revolución de Mayo', year: 2026 },
  { date: '2026-06-15', name: 'Paso a la Inmortalidad del Gral. Güemes', year: 2026 },
  { date: '2026-06-20', name: 'Día de la Bandera', year: 2026 },
  { date: '2026-07-09', name: 'Día de la Independencia', year: 2026 },
  { date: '2026-08-17', name: 'Paso a la Inmortalidad del Gral. San Martín', year: 2026 },
  { date: '2026-10-12', name: 'Día del Respeto a la Diversidad Cultural', year: 2026 },
  { date: '2026-11-16', name: 'Día de la Virgen de San Nicolás', year: 2026 },
  { date: '2026-12-08', name: 'Día de la Inmaculada Concepción', year: 2026 },
  { date: '2026-12-25', name: 'Navidad', year: 2026 },
];

export async function seedHolidays() {
  console.log('Seeding holidays...');
  for (const holiday of holidaysData) {
    await db.insert(holidays).values({
      ...holiday,
      source: 'seed',
    }).onConflictDoNothing();
  }
  console.log('Holidays seeded!');
}
