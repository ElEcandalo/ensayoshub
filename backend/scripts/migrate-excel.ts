import 'dotenv/config';
import { db } from '../src/lib/db.js';
import { clients, bookings, incomes } from '../src/db/schema.js';
import { eq } from 'drizzle-orm';
const XLSX = (await import('xlsx')).default;

const excelPath = '/mnt/c/Users/Usuario/Downloads/Escandalo 2026.xlsx';

const months = {
  'Enero': 1,
  'Febrero': 2,
  'Marzo': 3,
  'Abril': 4,
  'Mayo': 5,
};

const wb = XLSX.readFile(excelPath, { type: 'binary' });

const clientsMap = new Map();

async function findOrCreateClient(name: string) {
  const normalizedName = name.trim().toLowerCase();
  
  if (clientsMap.has(normalizedName)) {
    return clientsMap.get(normalizedName);
  }

  const existing = await db.query.clients.findFirst({
    where: eq(clients.name, name.trim()),
  });

  if (existing) {
    clientsMap.set(normalizedName, existing);
    return existing;
  }

  const [created] = await db.insert(clients).values({
    name: name.trim(),
    notes: `Migrado desde Excel Escándalo 2026`,
  }).returning();

  clientsMap.set(normalizedName, created);
  console.log(`  → Cliente creado: ${created.id} - ${name.trim()}`);
  return created;
}

function parseSchedule(schedule: string, month: number, year = 2026) {
  const sessions = [];
  
  const match = schedule.match(/(\d+)\s*(martes|mier|juev|sab|dom)/i);
  if (match) {
    const count = parseInt(match[1]);
    const dayName = match[2].toLowerCase();
    let dayOfWeek = 2;
    if (dayName.startsWith('mart')) dayOfWeek = 2;
    else if (dayName.startsWith('mier')) dayOfWeek = 3;
    else if (dayName.startsWith('juev')) dayOfWeek = 4;
    else if (dayName.startsWith('sab')) dayOfWeek = 6;

    for (let i = 1; i <= 4; i++) {
      const weekNum = Math.ceil(i);
      const date = new Date(year, month - 1, weekNum * 7 - 7 + dayOfWeek);
      if (date.getMonth() === month - 1) {
        sessions.push(date);
      }
    }
  }
  
  return sessions;
}

async function migrateEnero() {
  console.log('\n--- Enero ---');
  const ws = wb.Sheets['Enero'];
  const data = XLSX.utils.sheet_to_json(ws);

  for (const row of data) {
    const name = row['__EMPTY'];
    if (!name || name === 'Total') continue;

    const total = parseInt(row['Total']);
    const dias = row['Dias'] || '';
    const horarios = row['Horarios'] || '';
    const señas = parseInt(row['Seña']) || 0;

    console.log(`Procesando: ${name}, Total: ${total}`);

    const client = await findOrCreateClient(name);
    
    const sessionCount = parseInt(dias.match(/\d+/)?.[0] || '4');
    const year = 2026;
    const month = 1;
    const dayName = dias.toLowerCase();
    let dayOfWeek = 2;
    if (dayName.includes('martes')) dayOfWeek = 2;
    else if (dayName.includes('mier')) dayOfWeek = 3;

    const sessions = [];
    for (let week = 1; week <= 4; week++) {
      const date = new Date(year, 0, week * 7 - 7 + dayOfWeek);
      sessions.push(date);
    }

    const [startHour, startMin] = (horarios.split(' a ')[0] || '19:00').replace('.', ':').split(':').map(Number);
    const endTime = new Date(sessions[0]);
    endTime.setHours(startHour + 2, startMin, 0, 0);

    for (const sessionDate of sessions) {
      const startTime = new Date(sessionDate);
      startTime.setHours(startHour, startMin, 0, 0);

      const endDateTime = new Date(sessionDate);
      endDateTime.setHours(startHour + 2, startMin, 0, 0);

      const baseAmount = Math.round(total / sessionCount);
      
      const [created] = await db.insert(bookings).values({
        clientId: client.id,
        startTime: startTime.toISOString(),
        endTime: endDateTime.toISOString(),
        serviceType: 'rehearsal',
        status: 'completed',
        baseAmount: baseAmount.toString(),
        notes: `Migrado: ${dias}, ${horarios}`,
      }).returning();

      if (señas > 0) {
        await db.insert(incomes).values({
          amount: señas.toString(),
          bookingId: created.id,
          description: `Seña - ${name}`,
          date: sessions[0].toISOString().split('T')[0],
        }).returning();
      }

      const remaining = total - señas;
      if (remaining > 0) {
        await db.insert(incomes).values({
          amount: remaining.toString(),
          bookingId: created.id,
          description: `Resto - ${name}`,
          date: sessions[sessionCount - 1].toISOString().split('T')[0],
        }).returning();
      }
    }

    console.log(`  → ${sessions.length} bookings creados`);
  }
}

async function migrateFebrero() {
  console.log('\n--- Febrero ---');
  const ws = wb.Sheets['Febrero'];
  const data = XLSX.utils.sheet_to_json(ws);

  for (const row of data) {
    const servicio = row['AGUAS ARGENTINA'];
    if (!servicio || servicio === 'TOTAL') continue;

    const contacto = row['Contacto'];
    const total = parseInt(row['Total']) || 0;
    const horarios = row['Horarios'] || '';
    const estado = row['Seña'];
    
    if (total === 0 || !contacto) continue;

    console.log(`Procesando: ${servicio} (${contacto}), Total: ${total}`);

    const client = await findOrCreateClient(`${servicio} - ${contacto}`);

    const year = 2026;
    const month = 2;
    const dayOfWeek = 3;
    const sessions = [];
    for (let week = 1; week <= 4; week++) {
      const date = new Date(year, 1, week * 7 - 7 + dayOfWeek);
      sessions.push(date);
    }

    const startHour = parseInt(horarios.split(':')[0]) || 15;
    const startMin = parseInt(horarios.split(':')?.[1]?.replace('hs', '') || '0');

    for (const sessionDate of sessions) {
      const startTime = new Date(sessionDate);
      startTime.setHours(startHour, startMin, 0, 0);

      const endDateTime = new Date(sessionDate);
      endDateTime.setHours(startHour + 2, startMin, 0, 0);

      const baseAmount = Math.round(total / sessions.length);
      
      const [created] = await db.insert(bookings).values({
        clientId: client.id,
        startTime: startTime.toISOString(),
        endTime: endDateTime.toISOString(),
        serviceType: 'rehearsal',
        status: estado === 'Completo' ? 'completed' : 'confirmed',
        baseAmount: baseAmount.toString(),
        notes: `Migrado: ${horarios}`,
      }).returning();

      await db.insert(incomes).values({
        amount: baseAmount.toString(),
        bookingId: created.id,
        description: `${servicio} - ${contacto}`,
        date: sessionDate.toISOString().split('T')[0],
      }).returning();
    }

    console.log(`  → ${sessions.length} bookings creados`);
  }
}

async function migrateMarzo() {
  console.log('\n--- Marzo ---');
  const ws = wb.Sheets['Marzo'];
  const data = XLSX.utils.sheet_to_json(ws);

  for (const row of data) {
    const sala = row['Sala'];
    if (!sala || sala === 'ALQUILER  HABITACIONES' || sala.includes('Alquiler')) continue;

    const total = parseInt(row['Total']) || 0;
    const señas = parseInt(row['Seña']) || 0;
    const estado = row['Estado'];
    const horarios = row['Horario'] || '';
    const dias = row['__EMPTY'] || '';

    if (total === 0) continue;

    console.log(`Procesando: ${sala}, Total: ${total}, Estado: ${estado}`);

    const client = await findOrCreateClient(sala);

    const year = 2026;
    const month = 3;
    const sessions = [];

    const countMatch = dias.match(/(\d+)/);
    const sessionCount = countMatch ? parseInt(countMatch[1]) : 4;

    for (let week = 1; week <= sessionCount; week++) {
      const date = new Date(year, 2, week * 7 - 7 + 4);
      if (date.getMonth() === 2) {
        sessions.push(date);
      }
    }

    const [startHour, startMin] = (horarios.split(' a ')[0] || '18:30').replace('.', ':').split(':').map(Number);

    for (const sessionDate of sessions) {
      const startTime = new Date(sessionDate);
      startTime.setHours(startHour, startMin, 0, 0);

      const endDateTime = new Date(sessionDate);
      endDateTime.setHours(startHour + 2, startMin, 0, 0);

      const baseAmount = Math.round(total / sessionCount);
      const status = estado === 'Completo' ? 'completed' : estado === 'Suspendido' ? 'cancelled' : 'confirmed';
      
      const [created] = await db.insert(bookings).values({
        clientId: client.id,
        startTime: startTime.toISOString(),
        endTime: endDateTime.toISOString(),
        serviceType: 'rehearsal',
        status,
        baseAmount: baseAmount.toString(),
        notes: `Migrado: ${horarios}`,
      }).returning();

      if (señas > 0 && sessions.indexOf(sessionDate) === 0) {
        await db.insert(incomes).values({
          amount: señas.toString(),
          bookingId: created.id,
          description: `Seña - ${sala}`,
          date: sessionDate.toISOString().split('T')[0],
        }).returning();
      }
    }

    console.log(`  → ${sessions.length} bookings creados`);
  }
}

async function migrateAbril() {
  console.log('\n--- Abril ---');
  const ws = wb.Sheets['Abril'];
  const data = XLSX.utils.sheet_to_json(ws);

  for (const row of data) {
    const sala = row['Sala'];
    if (!sala || sala === 'Habitaciones' || sala === ' ' || sala.includes('Alquiler') || sala === 'Resto') continue;

    const total = parseInt(String(row['Total']).replace(/\$/g, '').replace(/\./g, '')) || 0;
    const señas = parseInt(String(row['Seña'] || '').replace(/\$/g, '').replace(/\./g, '')) || 0;
    const horarios = row['Horario'] || '';
    const modalidad = row['Modalidad'] || '';
    const cantidad = row['Cantidad'] || '';
    const estado = row['Estado'] || '';

    if (total === 0) continue;

    console.log(`Procesando: ${sala}, Total: ${total}, Modalidad: ${modalidad}`);

    const client = await findOrCreateClient(sala);

    const year = 2026;
    const month = 3;
    const sessions = [];

    const countMatch = cantidad.match(/(\d+)/);
    const sessionCount = countMatch ? parseInt(countMatch[1]) : 4;

    const dayNames = cantidad.toLowerCase();
    let dayOfWeek = 4;
    if (dayNames.includes('mier')) dayOfWeek = 3;
    else if (dayNames.includes('juev')) dayOfWeek = 4;
    else if (dayNames.includes('sab')) dayOfWeek = 6;
    else if (dayNames.includes('vier')) dayOfWeek = 5;

    for (let week = 1; week <= sessionCount; week++) {
      const date = new Date(year, 3, week * 7 - 7 + dayOfWeek);
      if (date.getMonth() === 3) {
        sessions.push(date);
      }
    }

    let startHour = 18;
    let startMin = 30;
    const timeMatch = horarios.match(/(\d+)[\.:](\d+)/);
    if (timeMatch) {
      startHour = parseInt(timeMatch[1]);
      startMin = parseInt(timeMatch[2]);
    }

    for (const sessionDate of sessions) {
      const startTime = new Date(sessionDate);
      startTime.setHours(startHour, startMin, 0, 0);

      const endDateTime = new Date(sessionDate);
      endDateTime.setHours(startHour + 2, startMin, 0, 0);

      const baseAmount = Math.round(total / sessionCount);
      const status = estado === 'PAGADO' || modalidad.includes('Mensual') ? 'completed' : 'confirmed';
      
      const [created] = await db.insert(bookings).values({
        clientId: client.id,
        startTime: startTime.toISOString(),
        endTime: endDateTime.toISOString(),
        serviceType: 'rehearsal',
        status,
        baseAmount: baseAmount.toString(),
        notes: `Migrado: ${horarios}, ${modalidad}`,
      }).returning();

      if (señas > 0 && sessions.indexOf(sessionDate) === 0) {
        await db.insert(incomes).values({
          amount: señas.toString(),
          bookingId: created.id,
          description: `Seña - ${sala}`,
          date: sessionDate.toISOString().split('T')[0],
        }).returning();
      }
    }

    console.log(`  → ${sessions.length} bookings creados`);
  }
}

async function migrateMayo() {
  console.log('\n--- Mayo ---');
  const ws = wb.Sheets['Mayo'];
  const data = XLSX.utils.sheet_to_json(ws);

  for (const row of data) {
    const sala = row['Sala'];
    if (!sala || sala === 'Habitaciones' || sala.includes('Alquiler')) continue;

    const horarios = row['Horario'] || '';
    const cantidad = row['Cantidad'] || '';
    const servicios = row['Servicios'] || '';

    console.log(`Procesando: ${sala}, ${horarios}, ${cantidad}`);

    const client = await findOrCreateClient(sala);

    const year = 2026;
    const month = 4;
    const sessions = [];

    const countMatch = String(cantidad).match(/(\d+)/);
    const sessionCount = countMatch ? parseInt(countMatch[1]) : 4;

    const dayNames = cantidad.toLowerCase();
    let dayOfWeek = 4;
    if (dayNames.includes('mier')) dayOfWeek = 3;
    else if (dayNames.includes('juev')) dayOfWeek = 4;
    else if (dayNames.includes('sab')) dayOfWeek = 6;

    for (let week = 1; week <= sessionCount; week++) {
      const date = new Date(year, 4, week * 7 - 7 + dayOfWeek);
      if (date.getMonth() === 4) {
        sessions.push(date);
      }
    }

    let startHour = 18;
    let startMin = 30;
    const timeMatch = horarios.match(/(\d+)[\.:](\d+)/);
    if (timeMatch) {
      startHour = parseInt(timeMatch[1]);
      startMin = parseInt(timeMatch[2]);
    }

    const estimatedTotal = 45000 * sessionCount;

    for (const sessionDate of sessions) {
      const startTime = new Date(sessionDate);
      startTime.setHours(startHour, startMin, 0, 0);

      const endDateTime = new Date(sessionDate);
      endDateTime.setHours(startHour + 2, startMin, 0, 0);

      const baseAmount = Math.round(estimatedTotal / sessionCount);
      
      await db.insert(bookings).values({
        clientId: client.id,
        startTime: startTime.toISOString(),
        endTime: endDateTime.toISOString(),
        serviceType: 'rehearsal',
        status: 'confirmed',
        baseAmount: baseAmount.toString(),
        notes: `Migrado (mayo): ${horarios}`,
      }).returning();
    }

    console.log(`  → ${sessions.length} bookings creados`);
  }
}

async function main() {
  console.log('=== MIGRACIÓN DE DATOS DESDE EXCEL ===');

  try {
    await migrateEnero();
    await migrateFebrero();
    await migrateMarzo();
    await migrateAbril();
    await migrateMayo();

    console.log('\n=== MIGRACIÓN COMPLETADA ===');
    
    const totalClients = await db.query.clients.findMany();
    const totalBookings = await db.query.bookings.findMany();
    const totalIncomes = await db.query.incomes.findMany();

    console.log(`Clientes: ${totalClients.length}`);
    console.log(`Bookings: ${totalBookings.length}`);
    console.log(`Ingresos: ${totalIncomes.length}`);
    
  } catch (error) {
    console.error('Error durante la migración:', error);
    process.exit(1);
  }
}

main();