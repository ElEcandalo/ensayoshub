import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../db/schema.js';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/ensayohub';

console.log('DB: Using connection string:', connectionString?.replace(/\/\/.*:.*@/, '//****:****@'));

const client = postgres(connectionString, { ssl: 'require' });
export const db = drizzle(client, { schema });

export type DB = typeof db;
