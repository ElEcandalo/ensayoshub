import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;

console.log('DATABASE_URL:', connectionString);

if (!connectionString) {
  console.error('❌ DATABASE_URL not set');
  process.exit(1);
}

const sql = postgres(connectionString, { 
  ssl: 'require',
  connect_timeout: 10
});

try {
  await sql`SELECT 1`;
  console.log('✅ Connected!');
  await sql.end();
  process.exit(0);
} catch (e: any) {
  console.error('❌ Error:', e.message);
  process.exit(1);
}