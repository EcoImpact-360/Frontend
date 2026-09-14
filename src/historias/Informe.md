# Informe Técnico del Proyecto Frontend

## 1. Resumen General
Este proyecto es una aplicación frontend construida con React y Vite para visualizar un dashboard de gestión de residuos en colegios. Consume datos del backend real (Spring Boot, ver `Backend/`) a través de su API REST (`/api/v1/...`).

Muestra métricas globales, ranking de aulas y alertas a partir de datos reales servidos por el backend, con una arquitectura simple y modular.

## 2. Estructura de Carpetas y Qué Hace Cada Una

### Raíz del proyecto
- `package.json`: define scripts y dependencias del proyecto.
- `.env` y `.env.example`: variables de entorno (`VITE_API_URL`, la URL base del backend).
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
- `/alerts` -> `Alerts`
- `*` -> página `404`

#### `src/pages/`
Contiene vistas de alto nivel.
- `Home.jsx`: página inicial con enlace al dashboard.
- `Dashboard.jsx`: vista principal de métricas y gráficas, usando `api/dashboardApi.js`.
- `Alerts.jsx`: listado y resolución de alertas.

#### `src/components/metrics/`
Componentes reutilizables de visualización de métricas.
- `MetricCard.jsx`: tarjeta para mostrar un valor (número, porcentaje o moneda).
- `BarChartComponent.jsx`: gráfico de barras con Recharts.
- `LineChartComponent.jsx`: gráfico de líneas con Recharts.

#### `src/components/alerts/`
- `AlertBadge.jsx`, `AlertCard.jsx`, `ResolveAlertModal.jsx`, `Toast.jsx`: UI de la página de alertas.

#### `src/api/` y `src/services/`
Capa de acceso a datos. Todo pasa por un único helper HTTP basado en `fetch`:
- `services/apiClient.js`: función `request(path, options)` — timeout, `AbortController`, y normalización de errores de red/HTTP a un formato consistente (`{status, code, message, details}`).
- `api/dashboardApi.js`: usa `request` para `/dashboard/global` y `/ranking` (consumido por `Dashboard.jsx`).
- `services/alertsApi.js`: **de momento simula el backend de alertas en `localStorage`** (no llama a `/api/v1/alerts` todavía), para poder demostrar la UI de alertas sin depender de que ese endpoint esté completo en el backend. Cuando el backend de alertas esté listo, esto debería migrarse a `request(...)` igual que `dashboardApi.js`.

> Antes existían un segundo cliente HTTP basado en Axios (`api/apiClient.js` + el hook `useFetch`) y varias funciones de servicio sin usar (`services/dashboardApi.js`, `services/rankingApi.js`, `services/wasteApi.js`). Se eliminaron por ser código muerto duplicado; toda la app usa ahora un único cliente HTTP (`services/apiClient.js`).

#### `src/utils/`
- `formatters.js`: formateadores de fecha, moneda, número, porcentaje y tiempo relativo.

#### `src/composables/`
- `apiConfig.js`: define `API_URL` desde `import.meta.env.VITE_API_URL` (no se usa en la ruta activa de peticiones, que centraliza la base URL en `services/apiClient.js`; queda como config auxiliar).

#### `src/tests/`
Tests con Vitest + Testing Library (`AlertCard`, `Dashboard`, `MetricCard`).

## 3. Cómo se Conectan las Carpetas (Flujo)
1. `main.jsx` monta `App.jsx`.
2. `App.jsx` habilita `BrowserRouter`.
3. `router/index.jsx` decide qué página cargar (`Home`, `Dashboard` o `Alerts`).
4. `Dashboard.jsx` consume datos con `api/dashboardApi.js`, que usa `services/apiClient.js` (`fetch` + timeout + manejo de errores) contra el backend real en `VITE_API_URL`.
5. `Alerts.jsx` consume datos con `services/alertsApi.js` (mock en `localStorage`, ver nota arriba).
6. Las páginas transforman los datos y los muestran con `MetricCard`, `BarChartComponent`, `AlertCard`, etc.
7. `utils/formatters.js` formatea valores en los componentes de UI.

## 4. Notas Técnicas
- Arquitectura por capas: `pages` (vista), `components` (UI reusable), `api`/`services` (acceso a datos), `utils` (helpers).
- Un único cliente HTTP (`services/apiClient.js`) centraliza timeout, cancelación y normalización de errores; evita que cada llamada reimplemente su propio manejo de errores.
- La página de Alertas todavía no está conectada al backend real (ver nota en `services/alertsApi.js`); es la pieza pendiente más visible de cara a producción.
- Ver `../../DEPLOY.md` (raíz del monorepo) para cómo se construye y despliega el frontend con Docker.

## 5. Tecnologías Usadas
- React 19
- Vite
- React Router DOM
- Recharts
- Vitest + Testing Library
- ESLint
- JavaScript (ES Modules)
- HTML/CSS

## 6. Scripts Principales
- `npm run dev`: inicia frontend en modo desarrollo.
- `npm run build`: compila para producción.
- `npm run preview`: previsualiza build.
- `npm run lint`: ejecuta linting.
- `npm test`: ejecuta la suite de tests (Vitest).
