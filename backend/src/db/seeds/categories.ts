import { db } from '../../lib/db.js';
import { categories } from '../schema.js';

export const defaultCategories = [
  { name: 'Alquiler Sala', type: 'income', isDefault: true },
  { name: 'Clase Particular', type: 'income', isDefault: true },
  { name: 'Evento', type: 'income', isDefault: true },
  { name: 'Otro Ingreso', type: 'income', isDefault: true },
  { name: 'Servicios (Luz/Internet)', type: 'expense', isDefault: true },
  { name: 'Limpieza', type: 'expense', isDefault: true },
  { name: 'Mantenimiento', type: 'expense', isDefault: true },
  { name: 'Sonido', type: 'expense', isDefault: true },
  { name: 'Insumos', type: 'expense', isDefault: true },
  { name: 'Honorarios', type: 'expense', isDefault: true },
  { name: 'Otro Gasto', type: 'expense', isDefault: true },
];

export async function seedCategories() {
  console.log('Seeding categories...');
  for (const cat of defaultCategories) {
    await db.insert(categories).values(cat).onConflictDoNothing();
  }
  console.log('Categories seeded!');
}
