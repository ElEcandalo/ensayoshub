# Tarea: Services Layer
## EnsayoHub

---

## Categoría
- [x] Mejora

## Estado
- [ ] Pendiente - Postergado para más adelante

## Agente(s) requerido(s)
- [x] backend

## Descripción
Refactorizar lógica de negocio a services layer para mejor testabilidad.

## Archivos a crear
- `backend/src/services/booking.service.ts`
- `backend/src/services/finance.service.ts`
- `backend/src/services/holiday.service.ts`

## Archivos a modificar
- `backend/src/routes/bookings.ts` (usar bookingService)
- `backend/src/routes/finances/incomes.ts` (usar financeService)

## Requerimientos específicos
1. **BookingService**
   - createBooking(dates, clientId, ...): valida cliente, crea bookings
   - confirmBooking(id, amount, date): cambia estado, crea income
   - completeBooking(id, actualEndTime?, extraAmount?): cambia estado, crea income extra
   - checkAvailability(date, start, end, excludeId?): verifica solapamiento
   - calculateExcess(scheduledEnd, actualEnd, serviceType): cálculo de excedente

2. **FinanceService**
   - getIncomesByPeriod(start, end)
   - getExpensesByPeriod(start, end)
   - calculateNetProfit(start, end)
   - getUpcomingExpenses(days)

3. **HolidayService**
   - isHoliday(date): verifica si es feriado
   - getHolidaysForYear(year)
   - syncHolidaysFromAPI(): consumir API argentina (opcional)

## Validación
- Tests unitarios pasan
- Lógica de negocio aislada de HTTP
- Repository pattern para DB queries
- Type-safe inputs/outputs
