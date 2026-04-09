# SDD Workflow - EnsayoHub
## Spec Driven Development basado en OpenSpec.dev

---

## Fases del SDD

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  EXPLORE    │ ──▶ │   PROPOSE   │ ──▶ │   SPECIFY   │
│ Explorar    │     │  Propuesta  │     │ Especificar │
│  codebase   │     │  (requer +  │     │  (detalle   │
│             │     │   diseño)    │     │   completo)  │
└─────────────┘     └─────────────┘     └─────────────┘
                                                 │
                                                 ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   DOCUMENT  │ ◀── │   VERIFY    │ ◀── │  IMPLEMENT  │
│ Documentar  │     │  Verificar  │     │ Implementar │
│  (README,  │     │  (tests,    │     │  (código    │
│   docs)     │     │   review)   │     │   real)     │
└─────────────┘     └─────────────┘     └─────────────┘
```

---

## Fase 1: EXPLORE (Explorar)

**Objetivo:** Entender el estado actual del codebase

**Preguntas a responder:**
- ¿Qué archivos existen?
- ¿Qué funcionalidades están implementadas?
- ¿Qué está incompleto o roto?
- ¿Cuál es la estructura de carpetas?

**Output:** Resumen del estado actual

---

## Fase 2: PROPOSE (Propuesta)

**Objetivo:** Definir QUÉ se va a hacer

### Requerimientos
- Lista de features/fixes necesarios
- Prioridad (high/medium/low)
- Criteria de aceptación

### Diseño
- Cambios de arquitectura necesarios
- Nuevos archivos/carpetas
- APIs a modificar
- Dependencias nuevas

**Output:** `docs/tasks/XX-nombre.md`

---

## Fase 3: SPECIFY (Especificar)

**Objetivo:** Detallar CÓMO se va a hacer

**Incluir:**
- Schema de DB (si aplica)
- Tipos TypeScript
- Endpoints API (si aplica)
- Componentes UI (si aplica)
- Casos edge
- Validaciones
- Estados de error

**Output:** Especificación detallada en `docs/specs/`

---

## Fase 4: IMPLEMENT (Implementar)

**Objetivo:** Escribir el código

**Reglas:**
1. Subagente recibe SOLO la spec, nada más
2. Empieza en "hoja en blanco"
3. Escribe código siguiendo patrones del ADR
4. Usa skills relevantes

**Output:** Archivos de código en locations especificadas

---

## Fase 5: VERIFY (Verificar)

**Objetivo:** Comprobar que funciona

**Checks:**
- [ ] TypeScript compila sin errores
- [ ] Tests pasan (si hay)
- [ ] Código sigue patrones del proyecto
- [ ] No hay duplicación
- [ ] Manejo de errores presente

**Output:** Reporte de verificación

---

## Fase 6: DOCUMENT (Documentar)

**Objetivo:** Mantener docs actualizadas

**Incluir:**
- Actualizar MEMORY.md si hay nuevas decisiones
- Actualizar PROJECT_STATE.md
- README si hay cambios significativos
- Comments en código si necesario

---

## Comandos de SDD

```bash
# Iniciar SDD para una tarea
./scripts/sdd.sh explore "agregar reportes CSV"

# Ver estado de specs
ls docs/specs/

# Limpiar specs completadas
./scripts/sdd.sh clean
```

---

## Skills por Fase

| Fase | Skills Relevantes |
|------|-------------------|
| EXPLORE | codebase-understanding |
| PROPOSE | requirements-gathering |
| SPECIFY | database-design, api-design |
| IMPLEMENT | react-patterns, nodejs-backend-patterns |
| VERIFY | testing-patterns |
| DOCUMENT | documentation-style |
