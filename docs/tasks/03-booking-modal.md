# Tarea: BookingModal Component
## EnsayoHub

---

## Categoría
- [x] Feature nuevo

## Estado
- [x] Completado 2026-04-09

## Agente(s) requerido(s)
- [x] frontend

## Descripción
Modal para crear/editar reservas con toda la lógica de negocio.

## Archivos a crear
- `frontend/src/components/booking/BookingModal.tsx`
- `frontend/src/components/booking/BookingCard.tsx`

## Requerimientos específicos
1. Selector de cliente con búsqueda
2. Datepicker para fechas (soporte múltiples si recurrente)
3. Timepickers para hora inicio/fin
4. Selector tipo: Ensayo / Clase
5. Checkbox "Recurrente"
6. Mostrar monto calculado automáticamente según tarifas
7. Detectar feriados (mostrar warning)
8. Validación:
   - Hora fin > hora inicio
   - Cliente obligatorio
   - No solapamiento (usar check-availability endpoint)

## Validación
- Puedo crear reserva individual
- Puedo crear reserva recurrente
- Monto se calcula correctamente
- Muestra warning en feriados
- Valida solapamiento
