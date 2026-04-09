import { db } from '../src/lib/db.js';
import { users } from '../src/db/schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

const passwordHash = await bcrypt.hash('Admin123!', 10);
await db.update(users).set({ passwordHash }).where(eq(users.email, 'admin@ensayohub.com'));
console.log('Password actualizada');