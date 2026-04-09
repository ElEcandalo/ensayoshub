# EnsayoHub - Guía de Inicio
## Qué es EnsayoHub?
EnsayoHub es el sistema que vamos a usar para gestionar las reservas de la sala de ensayo y las finanzas del espacio. Reemplaza las planillas de cálculo que usábamos antes.

Qué podemos hacer con esto:
- Ver la agenda de reservas
- Crear y gestionar reservas
- Registrar ingresos y gastos
- Ver métricas del negocio
- Generar reportes
---
## Primeros Pasos
### 1. Acceder al sistema
1. Abrir tu navegador (Chrome, Firefox, Edge)
2. Ir a la URL que te pasen (ej: https://ensayohub.com)
3. Ingresar tu email y contraseña

**Nota:** Si no tenés usuario, hablar con María para que te cree uno.

### 2. Navegación básica
| Sección | Para qué sirve |
|---------|----------------|
| Agenda | Ver y crear reservas |
| Finanzas | Ingresos y gastos |
| Dashboard | Métricas y gráficos |
| Reportes | Exportar información |
---
## Cómo crear una reserva
### Paso a paso:
1. Ir a Agenda
2. Seleccionar fecha - clickear en el día deseado
3. Crear nueva reserva - click en el horario o botón "+ Nueva Reserva"
4. Completar los datos:

| Campo | Qué poner |
|-------|-----------|
| Cliente | Elegir de la lista o crear nuevo |
| Fecha | La fecha seleccionada |
| Horario | Hora de inicio y fin |
| Tipo | Ensayo o Clase |
| Monto | Se calcula solo según las tarifas |

5. Guardar - la reserva aparece en la agenda

### Estados de reserva
- **pending** (amarillo): El cliente consultó, nochepagó seña
- **confirmed** (verde): Pagó la seña, está confirmado
- **completed** (gris): Ya usó el servicio
- **cancelled** (rojo): Se canceló

### Qué pasa si la fecha cae en feriados?
Si intentás crear una reserva en un día festivo, el sistema te va a preguntar:

"Este día es feriados (ej: 1° de Mayo). Querés:
- Reservar igual a precioferiado
- No reservar ese día"

Elegí la opción que corresponda según hayas hablado con el cliente.
---
## Registrar el pago de seña
Cuando un cliente te paga la seña:
1. Buscar la reserva en estado "pending" en la Agenda
2. Click en la reserva
3. Click en "Confirmar y registrar pago"
4. La reserva pasa a "confirmed" y se genera automáticamente el registro de ingreso
---
## Cuando el cliente termina
1. Buscar la reserva del día en la Agenda
2. Click en la reserva
3. Click en "Completar"
4. Si el cliente se pasó del horario:
   - +15 minutos: Preguntar si cobra 30 min extra
   - +30+ minutos: Preguntar si cobra 1 hora a precioferiado
5. Opcional: registrar el excedente
---
## Dashboard: Ver métricas
En Dashboard vas a encontrar:

| Widget | Qué muestra |
|--------|------------|
| Ocupación | % de horas usadas vs disponibles |
| Ingresos | Total facturado en el período |
| Gastos | Total de gastos en el período |
| Ganancia | Ingresos menos gastos |
| Comparativa | Fue mejor o peor que el mes pasado? |

Filtrar por período: Usá el selector "Este mes" para cambiar entre períodos (semana, mes, o rango personalizado).
---
## Registrar un gasto
1. Ir a Finanzas > Gastos
2. Click en "+ Nuevo gasto"
3. Completar:

| Campo | Ejemplo |
|-------|---------|
| Monto | 15000 |
| Categoría | Limpieza / Servicios / Mantenimiento / etc. |
| Descripción | Qué se pagó |
| Fecha de vencimiento | Cuándo se debe pagar |
| Fecha de pago | Dejar vacío si aún no se pagó |
| Es recurrente? | Mensual / Semanal / Una vez |

4. Guardar

### Seguimiento de pagos
| Estado | Significado |
|--------|-------------|
| Amarillo Pendiente | No se pagó todavía (antes del vencimiento) |
| Verde Pagado | Ya se registró el pago |
| Rojo Vencido | Pasó la fecha de vencimiento y no se pagó |
---
## Generar reportes
1. Ir a Reportes
2. Elegir tipo de reporte:
   - Resumen mensual
   - Detalle de reservas
   - Gastos
3. Seleccionar período
4. Click en "Generar"
5. Descargar en PDF o CSV
---
## Preguntas frecuentes
**Puedo modificar una reserva después de confirmarla?**
Sí, clickeá en la reserva y editá los campos necesarios.

**Qué hago si un cliente cancela?**
Click en la reserva > "Cancelar". Se registra como cancelada.

**Cómo agrego un nuevo cliente?**
Desde el formulario de reserva, click en "+ Nuevo Cliente" y completá los datos.

**El sistema me avisa cuando está por vencer un gasto?**
Sí, en Dashboard aparece un warning con los gastos pendientes de esta semana.
---
## Necesitás ayuda?
Si algo no funciona o tenés dudas:
1. Revisar este documento
2. Preguntarle a María
3. Crear un ticket en el link que te pasen

EnsayoHub v1.0 - Centro Cultural
