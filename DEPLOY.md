# Despliegue - EnsayoHub

## Arquitectura

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Vercel    │ ──> │   Render    │ ──> │   Neon      │
│  (Frontend) │     │  (Backend)  │     │  (Postgres) │
└─────────────┘     └─────────────┘     └─────────────┘
   Puerto 80          Puerto 10000         5432
```

## URLs de Producción

| Servicio | URL |
|----------|-----|
| Frontend | https://ensayoshub.vercel.app |
| Backend | https://ensayoshub.onrender.com |
| API | https://ensayoshub.onrender.com/api/v1 |

---

## Configuración de Archivos

### Vercel (vercel.json)
```json
{
  "framework": "vite",
  "buildCommand": "cd frontend && pnpm install && pnpm build",
  "outputDirectory": "frontend/dist",
  "installCommand": "pnpm install",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Importante:** La regla de `rewrites` es necesaria para que React Router funcione correctamente en SPA (Single Page Application).

### Render (render.yaml)
```yaml
services:
  - type: web
    name: ensayohub-backend
    env: node
    buildCommand: pnpm install && pnpm build
    startCommand: pnpm start
    plan: free
    autoDeploy: false
```

---

## Pasos para Desplegar

### 1. Pre-requisitos
- Repo en GitHub configurado
- Cuenta en Vercel y Render

### 2. Vercel (Frontend)
1. Ir a vercel.com
2. Importar repositorio `ElEcandalo/ensayoshub`
3. Configuration:
   - Framework Preset: **Vite**
   - Root Directory: `frontend` (o dejar raíz y usar buildCommand con `cd frontend`)
4. Environment Variables:
   - `VITE_API_URL` = `https://ensayoshub.onrender.com/api/v1`
5. Deploy

### 3. Render (Backend)
1. Ir a render.com
2. New > Web Service
3. Conectar repo `ElEcandalo/ensayoshub`
4. Configuration:
   - Root Directory: `backend`
   - Build Command: `pnpm install && pnpm build`
   - Start Command: `pnpm start`
   - Environment: Node
   - Plan: Free
5. Environment Variables:
   - `DATABASE_URL` = (URL de Neon)
   - `JWT_SECRET` = (generar con `openssl rand -base64 32`)
   - `PORT` = `10000`
   - `NODE_ENV` = `production`
6. Deploy

---

## Desarrollo Local

```bash
# Clonar repo
git clone https://github.com/ElEcandalo/ensayoshub.git
cd ensayoshub

# Instalar dependencias
cd backend && pnpm install
cd ../frontend && pnpm install

# Variables de entorno
cp backend/.env.example backend/.env
# Editar con tu URL de Neon

# Ejecutar
# Terminal 1: Backend
cd backend && pnpm dev  # http://localhost:3001

# Terminal 2: Frontend
cd frontend && pnpm dev  # http://localhost:5173
```

---

## Notas Importantes

### Render - Sleep Mode
- El plan gratuito entra en "sleep" después de **15 min** sin tráfico
- La primera request tardará ~30-60 seg en despertar
- Funciona bien para testing/uso personal

### Vercel - SPA Routing
- El `vercel.json` tiene rewrites para servir `index.html` en todas las rutas
- Esto permite que React Router maneje las rutas del cliente

### Neon - Base de Datos
- La DB ya tiene seed de categorías y feriados
- 512MB gratuito

---

## Resolver Problemas

### Frontend 404 en rutas
- Verificar que `vercel.json` tenga la regla de rewrites
- Hacer rebuild en Vercel después de cambios

### Backend no responde
- Verificar que Render esté desplegado (no en sleep)
- Revisar logs en Render dashboard

### Errores de TypeScript/ESLint en deploy
- El pre-commit hook debe pasar localmente antes de push
- Verificar que `pnpm typecheck` y `pnpm lint` pasen localmente

---

## Alternativas para Producción ($)

Si necesitás más estabilidad:
- **Railway** - Similar a Render pero más estable
- **Coolify** - Self-hosted en VPS (~$5/mes)
- **Neon** - Paid plans para más DB