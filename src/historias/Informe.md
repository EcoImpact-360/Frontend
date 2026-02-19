# Informe Técnico del Proyecto Frontend

## 1. Resumen General
Este proyecto es una aplicación frontend construida con React y Vite para visualizar un dashboard de gestión de residuos en colegios. Consume datos desde un backend simulado con `json-server` usando endpoints REST (por ejemplo: `/aulas` y `/contenedores`).

Actualmete solo se muestran  métricas, tarjetas y gráficas a partir de datos reales de `db.json`, con una arquitectura simple y modular.

## 2. Estructura de Carpetas y Qué Hace Cada Una

### Raíz del proyecto
- `package.json`: define scripts y dependencias del proyecto.
- `db.json`: base de datos fake consumida por `json-server`.
- `.env` y `.env.example`: variables de entorno (por ejemplo `VITE_API_URL`).
- `vite.config.js`: configuración de Vite.
- `eslint.config.js`: reglas de linting del proyecto.
- `index.html`: HTML principal donde se monta React.

### `src/`
Carpeta principal del código fuente del frontend.

#### `src/main.jsx`
Punto de entrada de React. Renderiza `<App />` con `StrictMode`.

#### `src/App.jsx`
Configura el router global con `BrowserRouter` y delega rutas a `src/router/index.jsx`.

#### `src/router/`
- `index.jsx`: define rutas:
- `/` -> `Home`
- `/dashboard` -> `Dashboard`
- `*` -> página `404`

#### `src/pages/`
Contiene vistas de alto nivel.
- `Home.jsx`: página inicial con enlace al dashboard.
- `Dashboard.jsx`: vista principal de métricas y gráficas. Aquí se consumen `/aulas` y `/contenedores` usando `useFetch`.

#### `src/components/metrics/`
Componentes reutilizables de visualización de métricas.
- `MetricCard.jsx`: tarjeta para mostrar un valor (número, porcentaje o moneda).
- `BarChartComponent.jsx`: gráfico de barras con Recharts.
- `LineChartComponent.jsx`: gráfico de líneas con Recharts.

#### `src/api/`
Capa de acceso a datos (servicios HTTP).
- `apiClient.js`: instancia de Axios con `baseURL`, headers e interceptores.
- `dashboardApi.js`: funciones para CRUD y métricas de `aulas` y `contenedores`.

#### `src/hooks/`
- `useFetch.js`: hook reutilizable para peticiones HTTP con manejo de `loading`, `error`, `data`, `refetch` y cancelación (`AbortController`).

#### `src/utils/`
Utilidades compartidas.
- `formatters.js`: formateadores de fecha, moneda, número, porcentaje y tiempo relativo.
- `apiHelpers.js`: manejo de errores de API, query strings, validación de estados HTTP y headers de autenticación.

#### `src/composables/`
- `apiConfig.js`: centraliza la URL base (`API_URL`) desde `import.meta.env.VITE_API_URL`.

#### `src/historias /`
Documentación funcional/técnica en formato Markdown.
- `tarea1.md`, `tareas2.md`, `tarea3.md`: historias de usuario y tareas.
- `Informe.md`: este informe.

## 3. Cómo se Conectan las Carpetas (Flujo)
1. `main.jsx` monta `App.jsx`.
2. `App.jsx` habilita `BrowserRouter`.
3. `router/index.jsx` decide qué página cargar (`Home` o `Dashboard`).
4. `Dashboard.jsx` consume datos con `useFetch`.
5. `useFetch` usa `apiClient.js` (Axios).
6. `apiClient.js` usa `API_URL` desde `composables/apiConfig.js`.
7. El backend fake (`json-server`) responde con datos de `db.json`.
8. `Dashboard.jsx` transforma datos y los muestra con `MetricCard` y `BarChartComponent`.
9. `utils/formatters.js` formatea valores en componentes de UI.

## 4. Contenido de Datos (db.json)
`db.json` contiene tres colecciones principales:
- `users`: gestores de limpieza con secciones asignadas.
- `aulas`: cubos por día (basura/reciclables), total semanal y gestor asociado.
- `contenedores`: ubicación, capacidad, nivel actual y depósitos por aula.

Esto permite simular escenarios reales de lectura y operaciones CRUD.

## 5. Notas Técnicas
- Se usa una arquitectura por capas: `pages` (vista), `components` (UI reusable), `hooks` (lógica), `api` (acceso a datos), `utils` (helpers).
- La URL del backend está centralizada, facilitando migrar de `json-server` a una API real sin refactor amplio.
- `Dashboard.jsx` ya no depende de mocks hardcodeados para métricas principales.
- Existe lógica de interceptores para token y manejo de `401` en `apiClient.js`.
- El script `npm run server` levanta `json-server` en el puerto `3000`.

## 6. Tecnologías Usadas
- React 19
- Vite
- React Router DOM
- Axios
- Recharts
- json-server (backend fake para desarrollo)
- ESLint
- JavaScript (ES Modules)
- HTML/CSS

## 7. Scripts Principales
- `npm run dev`: inicia frontend en modo desarrollo.
- `npm run build`: compila para producción.
- `npm run preview`: previsualiza build.
- `npm run lint`: ejecuta linting.
- `npm run server`: inicia `json-server` con `db.json` en `http://localhost:3000`.
