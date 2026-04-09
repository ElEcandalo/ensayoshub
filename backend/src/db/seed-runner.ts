import { seedCategories } from './seeds/categories.js';
import { seedHolidays } from './seeds/holidays.js';

async function main() {
  console.log('Starting seed...');
  await seedCategories();
  await seedHolidays();
  console.log('✅ Seed complete!');
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});