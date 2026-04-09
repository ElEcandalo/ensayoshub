import postgres from 'postgres';

const sql = postgres({
  host: 'db.ipgdqjrffadcareszbro.supabase.co',
  port: 6543,
  database: 'postgres',
  user: 'postgres',
  password: 'TXdARNGQlTrhlks0'
});

try {
  await sql`SELECT 1`;
  console.log('✅ Connected to Supabase!');
  await sql.end();
  process.exit(0);
} catch (e: any) {
  console.error('❌ Connection failed:', e.message);
  process.exit(1);
}