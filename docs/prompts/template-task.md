# Template de Nueva Tarea
---
## Categoría
[Marcar la categoría]
- [ ] Feature nuevo
- [ ] Bug fix
- [ ] Mejora
- [ ] Documentación
- [ ] Setup/Config
---
## Descripción
[Descripción clara de qué se necesita hacer]
---
## Contexto
[Por qué es necesario, qué problema resuelve]
---
## Archivos a modificar/crear
[Listar archivos específicos]
---
## Requerimientos específicos
[Puntos clave de implementación]
---
## Validación
[Cómosaber que está bien hecho]
---
## Notas adicionales
[Cualquier información extra relevante]
---
## Ejemplo completado
---
## Categoría
- [x] Feature nuevo
## Descripción
Crear componente de calendario para la agenda de reservas
## Contexto
Necesitamos mostrar las reservas en un calendario visual para que los admins puedan ver disponibilidad y crear nuevas reservas.
## Archivos a modificar/crear
- frontend/src/components/booking/AgendaCalendar.tsx
- frontend/src/pages/Agenda.tsx
- frontend/src/hooks/useBookings.ts
## Requerimientos específicos
- Usar react-big-calendar
- Vista mes/semana/día
- Colores por estado de reserva
- Click para crear reserva
- Click en reserva para editar
## Validación
- El calendario muestra reservas existentes
- Puedo crear una reserva desde el calendario
- Puedo editar una reserva existente
- Los colores corresponden a los estados (pending=amarillo, confirmed=verde, etc.)
