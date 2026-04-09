# RFC 1 — PRODUCTO
## EnsayoHub - Sistema de Gestión para Espacio de Ensayo y Eventos
---
## 1. Overview
**Nombre:** EnsayoHub
**Problema:** Gestión manual con planillas de cálculo que genera inconsistencias en disponibilidad, falta de trazabilidad financiera y dificultad para obtener métricas en tiempo real.
**Solución:** Plataforma unificada que centraliza reservas, finanzas y métricas con interfaz web accesible.
**Contexto:** Un único espacio, 3 usuarios administradores, clientes que reservan (sin acceso al sistema por ahora).
---
## 2. Objetivos
### Objetivos de negocio
| Objetivo | Métrica |
|----------|---------|
| Incrementar ocupación | % horas reservadas vs disponibles |
| Reducir gestión manual | Horas/mes dedicadas a admin |
| Visibilidad financiera clara | Reportes accesibles en 1 click |
| Evitar conflictos de horarios | Alertas de solapamiento |
### Objetivos de usuario
| Rol | Objetivo |
|-----|----------|
| Admin/Dueña | Gestionar todo, tomar decisiones basadas en datos |
| Colaboradora | Ver agenda, crear reservas en nombre de clientes |
---
## 3. Alcance
### MVP (Fase 1-4)
- [ ] Agenda visual con disponibilidad horaria configurable
- [ ] Crear reservas individuales o recurrentes (con datepicker múltiple)
- [ ] Estados: pending → confirmed → completed / cancelled
- [ ] Sistema de seña: confirmación automática al registrar pago
- [ ] Tarifas hardcodeadas por servicio y día (normal/FDS-feriado)
- [ ] Detección de feriados Argentina con pregunta al admin
- [ ] Penalización por excederse (15min/30min/hora-feriado)
- [ ] Registro de ingresos vinculados a reservas confirmadas
- [ ] Registro de gastos con fecha vencimiento, fecha pago, modalidad
- [ ] Dashboard con métricas core
- [ ] Reportes exportables (CSV, PDF)
- [ ] Migración desde Excel (5 hojas)
- [ ] Autenticación con roles (Admin / Colaborador)
### V2 (Futuro)
- [ ] Consultas en lenguaje natural
- [ ] Portal de cliente para auto-reserva
- [ ] Notificaciones (email/SMS)
- [ ] Liquidación colaboradores automática
- [ ] App móvil
---
## 4. User Personas
### P1 — Administradora (María)
Dueña del espacio. Maneja todo, quiere ver el cierre mensual de un vistazo. Necesita migración de sus planillas.
### P2 — Colaboradora (Lucía/u otra)
Ayuda con reservas. Puede crear/modificar bookings pero no accede a finanzas. No debe poder borrar reservas de otros.
### P3 — Cliente (Banda/Profesor)
Usa el espacio semanalmente. Paga seña antes del turno. No accede al sistema (comunica por WhatsApp).
---
## 5. Casos de Uso Principales
### CU-01: Crear Reserva Individual
Actor: Admin o Colaboradora
Flujo:
1. Seleccionar fecha en agenda
2. Elegir horario (inicio - fin)
3. Elegir tipo: Ensayo / Clase
4. Elegir modo: Normal / Recurrente → Si Recurrente: Agregar fechas específicas con datepicker
5. Vincular a cliente (o crear nuevo)
6. Sistema detecta si alguna fecha cae en feriado → Si cae: Preguntar "¿Reservar a precio feriado o saltar?"
7. Ingresar monto según tarifas vigentes
8. Confirmar → Se registra como "pending" (consulta)
9. Al registrar seña → Cambiar a "confirmed", generar ingreso
Postcondición: Reserva creada, ingreso registrado (si seña pagada)
### CU-02: Crear Reserva Recurrente
Actor: Admin
Flujo:
1. Checkbox "Recurrente" activado
2. Agregar fechas específicas con datepicker
3. Cada fecha se valida contra feriados
4. Si hay feriados: alerta → Admin decide por fecha
5. Monto calculado según tipo de día (normal vs FDS/feriado)
6. Registrar seña mensual (del 1 al 10)
Postcondición: Múltiples reservas creadas con patrón
### CU-03: Registrar Gasto
Actor: Admin
Flujo:
1. Ir a Finanzas > Gastos > Nuevo gasto
2. Completar: monto, categoría, descripción
3. Ingresar fecha vencimiento (cuándo se debe pagar)
4. Ingresar fecha pago (cuándo se pagó, puede ser null si impago)
5. Marcar si es recurrente (sistema sugiere próxima fecha)
6. Opcional: subir comprobante
7. Guardar
Postcondición: Gasto registrado, balance actualizado
### CU-04: Completar Reserva (con posible excedente)
Actor: Admin
Flujo:
1. Buscar reserva del día
2. Ingresar hora real de salida (si aplica)
3. Si excedió: → +15 min: Opción cobrar 30 min extra → +30 min: Opción cobrar 1 hora a tarifa feriados
4. Admin decide si registra excedente o no
5. Marcar como "completed"
Postcondición: Reserva completada, ingreso ajustado si corresponde
### CU-05: Ver Métricas
Actor: Admin
Flujo:
1. Ir a Dashboard
2. Ver: Ocupación, Ingresos, Gastos, Ganancia Neta
3. Filtrar por período
4. Ver comparativa vs período anterior
Postcondición: Admin tiene visibilidad del negocio
### CU-06: Generar Reporte
Actor: Admin
Flujo:
1. Ir a Reportes
2. Elegir tipo: Financiero / Reservas / Completo
3. Seleccionar período
4. Click en Generar
5. Descargar PDF o CSV
Postcondición: Reporte generado y descargado
---
## 6. Tarifas Hardcodeadas (MVP)
```typescript
const TARIFFS = {
  rehearsal: {
    weekday: 17000,    // Lun-Jue
    weekend_holiday: 18000,  // Vie, Sáb, Dom, Feriados
  },
  class: {
    weekday: 19000,
    weekend_holiday: 20000,
  }
};
// Penalización por excederse
const EXCESS_RULES = {
  gracePeriod: 15,      // minutos de tolerancia
  halfHourCharge: 30,   // +15-30 min = 30 min extra a tarifa normal
  fullHourCharge: 60,   // +30-60 min = 1 hora a tarifa feriado
};
```
---
## 7. KPIs Clave
| KPI |
|-----|
| Ocupación semanal |
| Ingreso promedio/reserva |
| Ganancia neta mensual |
| Reservas completadas |
| Tiempo de gestión |
---
## 8. Decisiones de Negocio Clave
**Estados de reserva**
- pending: El cliente consultó, nochepagó seña
- confirmed: Pagó la seña, está confirmado
- completed: Ya usó el servicio
- cancelled: Se canceló

**Flujo financiero**
Consulta (pending) → Seña pagada (confirmed) → Servicio completado (completed)
El ingreso se registra al confirmar (porque la seña ya se pagó).

**Recurrentes**
- Seña del 1 al 10 del mes
- Al generar instancias, si hay feriado: preguntar al admin

**Excedente horario**
- Opcional de registrar
- Si +15 min: cobrar 30 min extra a tarifa normal
- Si +30 min: cobrar 1 hora a tarifa feriados

**Gastos**
Siempre: fecha_vencimiento + fecha_pago + modalidad (recurrente/no)
