import { seedCategories } from '../db/seeds/categories.js';
import { seedHolidays } from '../db/seeds/holidays.js';

async function seed() {
  console.log('Poblando base de datos...');
  
  await seedCategories();
  await seedHolidays();
  
  console.log('✓ Datos iniciales cargados!');
  console.log('  - Categorías de ingresos/gastos');
  console.log('  - Feriados Argentina 2024-2026');
}

seed().catch(console.error);
