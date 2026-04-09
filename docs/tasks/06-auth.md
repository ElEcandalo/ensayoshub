# Tarea: Login + Auth Context
## EnsayoHub

---

## Categoría
- [x] Feature nuevo

## Estado
- [x] Completado 2026-04-09

## Agente(s) requerido(s)
- [x] frontend

## Descripción
Página de login y contexto de autenticación.

## Archivos a crear
- `frontend/src/pages/Login.tsx`
- `frontend/src/contexts/AuthContext.tsx`
- `frontend/src/hooks/useAuth.ts`

## Requerimientos específicos
1. Formulario login: email + password
2. Validación con Zod (z.email())
3. Llamar a `/api/v1/auth/login`
4. Guardar token en localStorage
5. AuthContext para compartir estado de usuario
6. Protected routes: redirigir a login si no hay token
7. Mostrar errores de login

## Validación
- Login funciona con credenciales válidas
- Errores se muestran para credenciales inválidas
- Token se guarda en localStorage
- Redirige a agenda tras login exitoso
