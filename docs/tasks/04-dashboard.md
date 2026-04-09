# Tarea: Dashboard Widgets
## EnsayoHub

---

## Categoría
- [x] Feature nuevo

## Estado
- [x] Completado 2026-04-09

## Agente(s) requerido(s)
- [x] frontend

## Descripción
Dashboard con métricas visuales usando Recharts.

## Archivos a crear
- `frontend/src/components/dashboard/KPICard.tsx`
- `frontend/src/components/dashboard/MetricsChart.tsx`
- `frontend/src/pages/Dashboard.tsx`
- `frontend/src/hooks/useDashboard.ts`

## Requerimientos específicos
1. KPICard para cada métrica:
   - Ocupación (%)
   - Ingresos totales
   - Gastos totales
   - Ganancia neta
2. Gráfico de línea: Ingresos vs Gastos por semana/mes
3. Selector de período: semana, mes, año, custom
4. Mostrar comparativa vs período anterior
5. Fetch con `/api/v1/dashboard/metrics`
6. Usar Recharts

## Validación
- Muestra todas las métricas
- Gráfico renderiza correctamente
- Puedo cambiar período
- Datos se actualizan al cambiar período
