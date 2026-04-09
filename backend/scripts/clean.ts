import 'dotenv/config';
import { db } from '../src/lib/db.js';
import { bookings, incomes, clients } from '../src/db/schema.js';
import { like, eq } from 'drizzle-orm';

async function main() {
  console.log('Eliminando datos migrados...');

  const incomesDeleted = await db.delete(incomes).where(like(incomes.description, '%Migrado%')).returning();
  console.log('Incomes eliminados:', incomesDeleted.length);

  const bookingsDeleted = await db.delete(bookings).where(like(bookings.notes, '%Migrado%')).returning();
  console.log('Bookings eliminados:', bookingsDeleted.length);

  const migrados = await db.select().from(clients).where(like(clients.notes, '%Migrado%'));
  console.log('Clientes a eliminar:', migrados.length);
  
  for (const c of migrados) {
    await db.delete(clients).where(eq(clients.id, c.id));
  }

  console.log('Limpieza completada');
}

main();