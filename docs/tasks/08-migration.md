# Tarea: Migración de Datos desde Excel
## EnsayoHub

---

## Categoría
- [ ] Feature nuevo

## Estado
- [ ] Pendiente

## Descripción
Migrar datos de reservas desde Excel "Escandalo 2026" a la base de datos.

## Datos a Migrar (Enero - Mayo 2026)

### Enero
| Cliente | Total | Días | Horario |
|---------|-------|------|---------|
| Lali | 114.000 | 4 Martes | 19 a 21 |
| Blas | 152.000 | 4 Miercoles | 18.30 a 20 |

### Febrero
| Cliente | Total | Contacto | Horario |
|---------|-------|----------|---------|
| METROGAS - Cami | 60.000 | Intensivo | 15:00 a 18hs |
| EDESUR - Corina | 34.000 | Ensayo | 18:00 a 20 |
| INTERNET | 94.000 | - | - |

### Marzo
| Sala | Total | Estado | Horario |
|------|-------|--------|---------|
| Julia | 142.500 | Completo | 18:30 a 21hs |
| Costa | 35.000 | Suspendido | - |
| Patricia | 228.000 | Completo | 9a10hs/18a19hs |

### Abril
| Sala | Total | Modalidad | Cantidad |
|------|-------|-----------|----------|
| Julia | 190.000 | Mensual | 4 jueves |
| Patricia | 228.000 | Mensual | 13 mar-mie-juev |
| Cande Ensayo | 178.500 | señal 44.000 | Jue 16,23,30 |
| Mauro Ensayos | 68.000 | señal | 13 y 27 |
| Abril Fisico | 50.000 | 50/50 | 4 Miercoles |

### Mayo
| Sala | Cantidad |
|------|----------|
| Julia | 4 jueves |
| Patricia | 12 |
| Cande Ensayo | Jue 16,23,30 |
| Abril Fisico | 4 Miercoles |

## Archivo Excel
`C:\Users\Usuario\Downloads\Escandalo 2026.xlsx`

## Script Existente
- `backend/scripts/migrate-excel.ts` (incompleto, necesita corrección)
- `backend/scripts/clean.ts` (para limpiar datos)

## Requerimientos
1. Crear clientes desde Excel
2. Crear bookings con horarios correctos
3. Crear incomes asociados a bookings
4. Fechas: 2026-01 a 2026-05

## Validación
- [ ] Todos los clientes creados
- [ ] Bookings en fechas correctas
- [ ] Incomes con montos correctos
- [ ] Verificar en frontend