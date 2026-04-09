# Instrucciones de Setup - EnsayoHub
## Ryzen 7 (16GB RAM)
---
## 1. Requisitos Previos
### Instalar Node.js 22
```bash
# Usando nvm (recomendado)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 22
nvm use 22

# Verificar
node --version  # Debe mostrar v22.x.x

# Instalar pnpm
npm install -g pnpm
pnpm --version

# Instalar Python (para scripts)
# Probablemente ya esté instalado
python3 --version

# Instalar Ollama (para agents locales)
curl -fsSL https://ollama.com/install.sh | sh
# Descargar modelo Mixtral
ollama pull mixtral
# Verificar
ollama list
```
---
## 2. Crear estructura del proyecto
```bash
# Crear carpeta del proyecto
mkdir -p ~/proyectos/ensayohub
cd ~/proyectos/ensayohub

# Crear estructura
mkdir -p docs/prompts docs/rfc frontend backend
```
---
## 3. Crear API key de Anthropic
1. Ir a https://console.anthropic.com
2. Crear cuenta (o login)
3. Ir a API Keys
4. Crear nueva key
5. Copiar y guardar en un lugar seguro

```bash
# Agregar al ~/.bashrc
export ANTHROPIC_API_KEY="tu-api-key-aqui"
source ~/.bashrc
```
---
## 4. Configurar Supabase (opcional para desarrollo)
1. Ir a https://supabase.com
2. Crear proyecto nuevo
3. Copiar las credenciales del proyecto:
   - Project URL
   - anon/public key
   - service role key

```bash
# Agregar al ~/.bashrc
export SUPABASE_URL="tu-url"
export SUPABASE_ANON_KEY="tu-key"
export SUPABASE_SERVICE_KEY="tu-service-key"
source ~/.bashrc
```
---
## 5. Scripts básicos para agents
Script para llamar a Claude (guardar como ~/scripts/claude.sh)
```bash
#!/bin/bash
# ~/scripts/claude.sh

ANTHROPIC_API_KEY="${ANTHROPIC_API_KEY:-}"
SYSTEM_PROMPT=$(cat "$1")
USER_PROMPT=$(cat "$2")

if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo "Error: ANTHROPIC_API_KEY no está configurada"
    exit 1
fi

curl -X POST https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d "{
    \"model\": \"claude-3-5-haiku-20241022\",
    \"max_tokens\": 4096,
    \"system\": $(echo "$SYSTEM_PROMPT" | jq -Rs .),
    \"messages\": [{\"role\": \"user\", \"content\": $(echo "$USER_PROMPT" | jq -Rs .)}]
  }"

chmod +x ~/scripts/claude.sh
```
---
## 6. Uso básico
**Paso 1:** Copiar archivos del proyecto
Copiar todos los archivos .md a ~/proyectos/ensayohub/docs/

**Paso 2:** Usar el Orquestador
```bash
cd ~/proyectos/ensayohub

# Llamar al orquestador con una tarea
cat docs/prompts/template-task.md | ./scripts/claude.sh \
  docs/prompts/prompt-orquestador.md \
  docs/tasks/nueva-tarea.txt
```

**Paso 3:** Generar código
```bash
# Generar componente React
cat docs/tasks/componente-reserva.txt | ./scripts/claude.sh \
  docs/prompts/prompt-agent-frontend.md
```
---
## 7. Estructura de archivos esperada
```
~/proyectos/ensayohub/
├── docs/
│   ├── rfc/
│   │   ├── rfc-producto.md
│   │   └── rfc-arquitectura.md
│   ├── prompts/
│   │   ├── prompt-orquestador.md
│   │   ├── prompt-agent-frontend.md
│   │   ├── prompt-agent-backend.md
│   │   └── prompt-agent-db.md
│   └── tasks/
│       └── template-task.md
├── frontend/
├── backend/
└── scripts/
    └── claude.sh
```
---
## 8. Comandos útiles
```bash
# Ver consumo de recursos
htop

# Ver modelos de Ollama disponibles
ollama list

# Probar Ollama localmente
ollama run mixtral "Hola, cómo estás?"

# Ver variables de entorno
env | grep -E "(ANTHROPIC|SUPABASE)"
```
---
## 9. Próximos pasos
1. [ ] Copiar todos los archivos .md a la Ryzen
2. [ ] Instalar Node.js 22 y pnpm
3. [ ] Instalar Ollama y descargar Mixtral
4. [ ] Crear cuenta en Anthropic y obtener API key
5. [ ] Configurar variables de entorno
6. [ ] Hacer un test: ejecutar un prompt simple
7. [ ] Empezar con el setup del proyecto frontend/backend
