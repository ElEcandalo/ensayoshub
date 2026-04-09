# Tarea: Layout Component + Navegación
## EnsayoHub

---

## Categoría
- [x] Feature nuevo

## Estado
- [x] Completado 2026-04-09

## Agente(s) requerido(s)
- [x] frontend

## Descripción
Crear el Layout principal con sidebar de navegación.

## Contexto
Necesitamos un layout base para toda la aplicación. Debe incluir:
- Sidebar con links a todas las secciones
- Header con usuario logueado
- Área de contenido principal

## Archivos a crear
- `frontend/src/components/Layout.tsx`
- `frontend/src/components/Sidebar.tsx`
- `frontend/src/components/Header.tsx`

## Requerimientos específicos
1. Sidebar fijo a la izquierda
2. Links: Agenda, Clientes, Dashboard, Finanzas (dropdown Ingresos/Gastos)
3. Indicador visual de página activa
4. Header con nombre de usuario y logout
5. Responsive: en mobile, sidebar se oculta tras botón hamburguesa
6. Usar TailwindCSS con las variables CSS del proyecto
7. Integración con React Router para navegación

## Validación
- Se puede navegar entre todas las páginas
- El usuario ve su nombre
- El logout funciona (limpia token y redirige a login)
- Responsive en móvil
