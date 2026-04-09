# Tarea: AgendaCalendar Component
## EnsayoHub

---

## Categoría
- [x] Feature nuevo

## Estado
- [x] Completado 2026-04-09

## Agente(s) requerido(s)
- [x] frontend

## Descripción
Crear el calendario de agenda usando react-big-calendar con integración a la API.

## Archivos a crear
- `frontend/src/components/booking/AgendaCalendar.tsx`
- `frontend/src/pages/Agenda.tsx`
- `frontend/src/hooks/useBookings.ts`

## Requerimientos específicos
1. Usar react-big-calendar con vistas: mes, semana, día
2. Mostrar reservas con colores según estado:
   - pending: amarillo
   - confirmed: verde
   - completed: gris
   - cancelled: rojo
3. Click en slot vacío → abrir BookingModal para crear
4. Click en reserva → abrir modal de detalle/editar
5. Fetch con TanStack Query
6. Sincronizar con `/api/v1/bookings` del backend

## Validación
- Muestra reservas existentes
- Puedo crear reserva desde calendario
- Puedo ver/editar reserva existente
- Colores correctos por estado
