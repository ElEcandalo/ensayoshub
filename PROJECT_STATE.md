# Estado del Proyecto - EnsayoHub
## Última actualización: 2026-04-09

---

## Progreso General

| Fase | Estado | Notas |
|------|--------|-------|
| Docs/Prompts | ✅ Completo | RFC, prompts agentes, ADR, SDD |
| Setup Herramientas | ✅ Completo | Node 22, pnpm, Ollama qwen2.5:7b |
| Backend API | ✅ Completo | 14 archivos, endpoints completos |
| Frontend Components | ✅ Completo | Layout, Agenda, Dashboard, Finance, Login |
| SDD Workflow | ✅ Nuevo | Scripts de orquestación mejorados |
| DB Setup | ⏳ Pendiente | Requiere Supabase + .env |
| Testing | ⏳ Pendiente | - |

---

## Ecosystem Stack (Basado en Gentle AI Stack)

```
┌─────────────────────────────────────────────────────────────┐
│                    ORQUESTADOR PRINCIPAL                    │
│                  (Vos / Humano)                            │
│  "Ustedes son orquestadores del orquestador"               │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    MEMORY.md (Engram)                       │
│  Decisiones, bugs, patrones, aprendizajes persistidos     │
└─────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    SDD Workflow                             │
│  explore → propose → specify → implement → verify → doc    │
└─────────────────────────────────────────────────────────────┘
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
┌──────────────────┐     ┌──────────────────┐
│   SUBAGENTE 1    │     │   SUBAGENTE 2    │
│   (Frontend)     │     │   (Backend)      │
│   3% contexto    │     │   3% contexto    │
└──────────────────┘     └──────────────────┘
```

---

## Scripts Disponibles

```bash
# Orquestación básica
~/scripts/orchestrate.sh status          # Estado del proyecto
~/scripts/orchestrate.sh task <archivo>  # Ejecutar tarea con agente
~/scripts/orchestrate.sh agent <tipo>     # Ejecutar agente específico

# SDD Workflow (Spec Driven Development)
~/scripts/sdd.sh explore "nombre tarea"   # Explorar y crear propuesta
~/scripts/sdd.sh implement <spec>       # Delegar implementación
~/scripts/sdd.sh status                   # Ver specs pendientes
~/scripts/sdd.sh list                    # Listar tareas

# Ollaama directo
~/scripts/ollama-agent.sh -a frontend <tarea.md>
~/scripts/ollama-agent.sh -a backend <tarea.md>
```

---

## Archivos Clave

| Archivo | Descripción |
|---------|-------------|
| `MEMORY.md` | Memoria persistente (Engram) - decisiones, bugs, patrones |
| `docs/SDD.md` | Workflow SDD documentado |
| `docs/ADR.md` | Architecture Decision Records |
| `docs/tasks/` | Tareas pendientes para agentes |
| `docs/specs/` | Especificaciones detalladas (SDD) |

---

## Flujo de Trabajo Recomendado

### 1. Nueva Feature
```bash
# 1. Explorar y crear propuesta
~/scripts/sdd.sh explore "agregar reportes CSV"

# 2. Editar propuesta en docs/tasks/

# 3. Crear spec detallada
~/scripts/sdd.sh spec 08-reportes

# 4. Implementar con subagente
~/scripts/sdd.sh implement docs/specs/08-reportes.md

# 5. Verificar y documentar
```

### 2. Continuar desde donde quedó
```bash
# Ver estado
~/scripts/sdd.sh status

# Leer MEMORY.md para contexto
cat MEMORY.md

# Continuar tarea específica
~/scripts/sdd.sh implement docs/specs/03-booking-modal.md
```

---

## Para Continuar Inmediatamente

### 1. Configurar DB
```bash
# Crear cuenta en supabase.com
# Copiar DATABASE_URL a backend/.env

cd ~/proyectos/ensayohub/backend
export PATH="$HOME/nodejs/bin:$PATH"
pnpm db:push    # Aplica schema
pnpm db:seed    # Pobla categorías y feriados
```

### 2. Probar
```bash
# Terminal 1: Backend
cd ~/proyectos/ensayohub/backend
pnpm dev

# Terminal 2: Frontend  
cd ~/proyectos/ensayohub/frontend
pnpm dev
```

### 3. Testing
```bash
# Pendiente: configurar Vitest + Playwright
```

---

## Lecciones Aprendidas

1. **Agentes locales (Ollama)** funcionan pero necesitan refinamiento
2. **Código repetitivo** conviene delegar a agentes
3. **Decisiones críticas** necesitan documentarse en MEMORY.md
4. **Specs detalladas** reducen iteraciones de corrección
5. **Human in the loop** es essential - revisar antes de aceptar

---

## Recursos

- Video referencia: [Gentle AI Stack - Alan from Gentleman Programming](https://www.youtube.com/watch?v=UoS_LP-PCG8)
- OpenSpec.dev: Especificaciones legibles por IA
- Skills configuradas:
  - nodejs-backend-patterns
  - architecture-patterns
  - supabase-postgres-best-practices
  - zod-4
