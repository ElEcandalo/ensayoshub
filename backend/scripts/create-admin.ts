import { db } from '../src/lib/db.js';
import { users } from '../src/db/schema.js';
import bcrypt from 'bcrypt';

async function createAdmin() {
  const email = process.argv[2] || 'admin@ensayohub.com';
  const password = process.argv[3] || 'admin123';
  const name = process.argv[4] || 'Admin';

  console.log('Creando usuario admin...');
  console.log(`Email: ${email}`);

  const passwordHash = await bcrypt.hash(password, 10);

  const [user] = await db.insert(users).values({
    email,
    passwordHash,
    name,
    role: 'admin',
  }).returning();

  console.log('✓ Admin creado exitosamente!');
  console.log(`ID: ${user.id}`);
  console.log('');
  console.log('Credenciales:');
  console.log(`  Email: ${email}`);
  console.log(`  Password: ${password}`);
  console.log('');
  console.log('Cambiá la password después del primer login!');
}

createAdmin().catch(console.error);
