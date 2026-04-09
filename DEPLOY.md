# Despliegue - EnsayoHub

## Arquitectura

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Vercel    │ ──> │   Render    │ ──> │   Neon      │
│  (Frontend) │     │  (Backend)  │     │  (Postgres) │
└─────────────┘     └─────────────┘     └─────────────┘
   Puerto 80          Puerto 10000         5432
```

## Pasos para Desplegar

### 1. Neon (Base de Datos) - Ya configurado
Tu DB ya está en: `neondb`

### 2. Vercel (Frontend)

```bash
# Opción A: Desde la web
# 1. Ir a vercel.com
# 2. Importar repositorio de GitHub
# 3. Configurar:
#    - Framework Preset: Vite
#    - Build Command: pnpm build
#    - Output Directory: dist

# Opción B: CLI
cd frontend
pnpm add -g vercel
vercel --prod
```

### 3. Render (Backend)

```bash
# Opción A: Desde la web
# 1. Ir a render.com
# 2. New > Web Service
# 3. Conectar repo de GitHub
# 4. Configurar:
#    - Build Command: pnpm install && pnpm build
#    - Start Command: pnpm start
#    - Environment: Node
#    - Free instance

# Variables de entorno en Render:
DATABASE_URL=postgresql://...@neon.tech/neondb
JWT_SECRET=genera-una-nueva-clave-segura
PORT=10000
NODE_ENV=production
```

### 4. Actualizar Frontend

Una vez deployed el backend, actualizar en `frontend/.env`:
```
VITE_API_URL=https://ensayohub-backend.onrender.com/api/v1
```

## Notas Importantes

### Render - Sleep Mode
El plan gratuito de Render entra en "sleep" después de 15 min sin tráfico.
- La primera request tardará ~30-60 seg en despertar
- Funciona bien para testing, no ideal para producción

### Para producción estable ($)
Considerar:
- Railway (más estable que Render)
- Coolify (self-hosted en VPS)

## Scripts Útiles

```bash
# Build local
cd frontend && pnpm build
cd backend && pnpm build

# Probar producción local
# Frontend
cd frontend && pnpm preview
# Backend
cd backend && pnpm start
```