# Tarea: Finance Components
## EnsayoHub

---

## Categoría
- [x] Feature nuevo

## Estado
- [x] Completado 2026-04-09

## Agente(s) requerido(s)
- [x] frontend

## Descripción
Formularios y listas para gestionar ingresos y gastos.

## Archivos a crear
- `frontend/src/components/finance/ExpenseForm.tsx`
- `frontend/src/components/finance/IncomeForm.tsx`
- `frontend/src/components/finance/ExpenseTable.tsx`
- `frontend/src/components/finance/IncomeTable.tsx`
- `frontend/src/pages/finance/Expenses.tsx`
- `frontend/src/pages/finance/Incomes.tsx`
- `frontend/src/hooks/useExpenses.ts`
- `frontend/src/hooks/useIncomes.ts`
- `frontend/src/hooks/useCategories.ts`

## Requerimientos específicos
### ExpenseForm
- Monto (number)
- Categoría (select desde API)
- Descripción
- Fecha vencimiento
- Fecha pago (opcional)
- Recurrencia: none/weekly/monthly/yearly

### ExpenseTable
- Lista de gastos con paginación
- Filtros: estado (pending/paid/overdue)
- Indicador visual de estado con color
- Acciones: editar, marcar como pagado, eliminar

### IncomeTable
- Lista simple de ingresos
- Filtro por fecha
- Mostrar descripción y fecha

## Validación
- Puedo crear gasto con todos los campos
- Puedo marcar gasto como pagado
- Filtros funcionan
- Tablas muestran datos correctamente
