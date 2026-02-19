# Informe Técnico del Proyecto - Geolocalizar (Frontend)

## 1. Estructura General del Proyecto

```
geolocalizar/Frontend/
├── src/
│   ├── api/                      # Cliente Axios y funciones de API
│   ├── components/               # Componentes React reutilizables
│   │   ├── aulas/                # Componentes relacionados con aulas
│   │   ├── alertas/              # Componentes relacionados con alertas
│   │   ├── contenedores/         # Componentes relacionados con contenedores
│   │   └── metrics/              # Componentes de métricas y gráficos
│   ├── composables/              # Configuración de la API (URL base)
│   ├── hooks/                    # Custom Hooks de React
│   ├── pages/                    # Páginas principales de la aplicación
│   ├── router/                   # Configuración de rutas
│   ├── services/                # Servicios de API (fetch)
│   ├── utils/                   # Utilidades (formateadores)
│   ├── historias/                # Documentación de historias de usuario
│   ├── tests/                   # Pruebas unitarias y de integración
│   ├── App.jsx                  # Componente raíz
│   ├── main.jsx                 # Punto de entrada
│   ├── index.css                # Estilos globales
│   └── App.css                  # Estilos de App
├── server.js                     # Servidor JSON-Server (API falsa)
├── db.json                      # Base de datos JSON (datos persistentes)
└── package.json                 # Dependencias y scripts
```

---

## 2. Descripción de Cada Archivo y su Función

### 2.1 Punto de Entrada

| Archivo | Descripción | Conexiones |
|---------|-------------|------------|
| `src/main.jsx` | Punto de entrada de React. Renderiza el componente `App` dentro de `BrowserRouter` | Importa `App` de `./App.jsx` |
| `src/App.jsx` | Componente raíz que envuelve toda la aplicación con `BrowserRouter` | Renderiza `Router` desde `./router/index.jsx` |

### 2.2 Router (Enrutamiento)

| Archivo | Descripción | Rutas Definidas |
|---------|-------------|-----------------|
| `src/router/index.jsx` | Define las rutas de la aplicación usando `react-router-dom` | `/` → `Home`, `/dashboard` → `Dashboard`, `/alerts` → `Alerts`, `*` → `NotFound` |

### 2.3 Páginas (Pages)

| Archivo | Descripción | Dependencias |
|---------|-------------|--------------|
| `src/pages/Home.jsx` | Página de inicio con enlaces al Dashboard y Alertas | `Link` de `react-router-dom` |
| `src/pages/Dashboard.jsx` | Panel administrativo principal. Muestra métricas, gráficos, lista de aulas y contenedores con CRUD completo | `useAulas`, `useContenedores`, `MetricCard`, `BarChartComponent`, `AulaList`, `ContenedorList`, `ModalAula`, `ModalContenedor` |
| `src/pages/Alerts.jsx` | Página de gestión de alertas. Muestra lista de alertas, permite resolverlas | `AlertCard`, `ResolveAlertModal`, `Toast`, `getAlerts`, `resolveAlert` de `alertsApi` |

### 2.4 Componentes de Aulas

| Archivo | Descripción | Ubicación en el proyecto |
|---------|-------------|-------------------------|
| `src/components/aulas/AulaCard.jsx` | Tarjeta visual que muestra los datos de un aula (nombre, ID, % reciclado, kg por categoría). Incluye botones de editar y eliminar | TK-001-01 |
| `src/components/aulas/AulaList.jsx` | Contenedor que renderiza todas las aulas en una grilla responsiva. Ordena alfabéticamente por nombre. Incluye botón "+ Agregar Aula" | TK-001-03 |
| `src/components/aulas/ModalAula.jsx` | Modal para crear o editar un aula. Formulario con campos: nombre, cubos por día (lunes-viernes). Calcula total automáticamente | TK-001-08 |

### 2.5 Componentes de Contenedores

| Archivo | Descripción | Ubicación en el proyecto |
|---------|-------------|-------------------------|
| `src/components/contenedores/ContenedorCard.jsx` | Tarjeta visual para contenedor con barra de progreso. Muestra: nombre, ubicación, capacidad, nivel actual, kg restantes. Colores: verde <60%, amarillo 60-80%, rojo >80% | TK-001-02, TK-001-12 |
| `src/components/contenedores/ContenedorList.jsx` | Componente colapsable/expandible que muestra todos los contenedores. Ordena por ubicación o ID. Incluye botón "+ Agregar" dentro del header | TK-001-04 |
| `src/components/contenedores/ModalContenedor.jsx` | Modal para crear o editar un contenedor. Campos: nombre, ubicación, capacidad máxima, nivel actual, última vaciada. Preview visual del nivel de llenado en tiempo real | TK-001-09 |

### 2.6 Componentes de Alertas

| Archivo | Descripción |
|---------|-------------|
| `src/components/alerts/AlertCard.jsx` | Tarjeta que muestra una alerta con título, mensaje, severidad, fecha. Incluye botón "Resolver" si no está resuelta |
| `src/components/alerts/AlertBadge.jsx` | Badge que muestra la severidad de la alerta (high/medium/low) con colores |
| `src/components/alerts/ResolveAlertModal.jsx` | Modal de confirmación para resolver una alerta |
| `src/components/alerts/Toast.jsx` | Componente de notificación temporal (éxito/error) |

### 2.7 Componentes de Métricas y Gráficos

| Archivo | Descripción |
|---------|-------------|
| `src/components/metrics/MetricCard.jsx` | Tarjeta que muestra una métrica con título, valor formateado (número, moneda, porcentaje), ícono opcional y tendencia |
| `src/components/metrics/BarChartComponent.jsx` | Gráfico de barras usando `recharts`. Muestra comparaciones de métricas |
| `src/components/metrics/LineChartComponent.jsx` | Gráfico de líneas usando `recharts`. Muestra tendencias en el tiempo |

### 2.8 Custom Hooks

| Archivo | Descripción | Funcionalidades |
|---------|-------------|-----------------|
| `src/hooks/useAulas.js` | Hook para CRUD de aulas. Maneja carga, creación, edición, eliminación y refresco automático después de operaciones | `useFetch`, `request` de `apiClient`, funciones: `createAula`, `updateAula`, `deleteAula`, `refetch` |
| `src/hooks/useContenedores.js` | Hook para CRUD de contenedores. Similar a `useAulas` pero para contenedores | `useFetch`, `request` de `apiClient`, funciones: `createContenedor`, `updateContenedor`, `deleteContenedor`, `refetch` |
| `src/hooks/useFetch.js` | Hook genérico para realizar peticiones HTTP. Proporciona estados: `data`, `loading`, `error`, y función `refetch`. Usa `apiClient` de `./api/apiClient` | `apiClient` de `./api/apiClient` |

### 2.9 Servicios y Cliente API

| Archivo | Descripción | Funcionalidades |
|---------|-------------|-----------------|
| `src/api/apiClient.js` | Cliente Axios configurado con la URL base de la API. Incluye interceptores para token de autenticación y manejo de errores 401 | `API_URL` de `../composables/apiConfig`, maneja `localStorage.getItem('token')` |
| `src/api/dashboardApi.js` | Funciones de API para el dashboard. Endpoints para aulas, contenedores y cálculo de métricas | Usa `apiClient` de `./apiClient`, funciones: `getAulas`, `getContenedores`, `getAulaById`, `getContenedorById`, `createAula`, `updateAula`, `deleteAula`, `createContenedor`, `updateContenedor`, `deleteContenedor`, `getMetrics`, `getAulasData`, `getContenedoresData` |
| `src/services/apiClient.js` | Cliente Fetch alternativo para alertas. Configura la URL base usando `API_URL` de `../composables/apiConfig`. Manejo de errores, timeouts, y parsing de respuestas | `API_URL` de `../composables/apiConfig`, función `request(path, options)` |
| `src/services/alertsApi.js` | Funciones de API para alertas. `getAlerts(params)` y `resolveAlert(id)` | Usa `request` de `./apiClient`, función auxiliar `buildQuery` |

### 2.10 Configuración

| Archivo | Descripción | Uso |
|---------|-------------|-----|
| `src/composables/apiConfig.js` | Archivo de configuración de la URL de la API. Exporta `API_URL` que puede ser sobrescrito por variable de entorno `VITE_API_URL` | Valor por defecto: `http://localhost:3000` |

### 2.11 Utilidades

| Archivo | Descripción | Funciones |
|---------|-------------|-----------|
| `src/utils/formatters.js` | Funciones de formateo para fechas, monedas, números, porcentajes y tiempo relativo | `formatDate`, `formatCurrency`, `formatNumber`, `formatPercentage`, `formatRelativeTime` |
| `src/utils/apiHelpers.js` | Utilidades adicionales para API |

---

## 3. Flujo de Datos y Conexiones

### 3.1 Flujo General

```
PÁGINAS
    │
    ├── Home.jsx
    ├── Dashboard.jsx ───────► useAulas() ──► apiClient ──► JSON-Server ──► db.json
    │                        ───────► useContenedores()
    │
    └── Alerts.jsx ──────────► alertsApi ────► apiClient (fetch) ──► JSON-Server ──► db.json
```

### 3.2 Conexiones Específicas

#### Dashboard → Hooks → API → Servidor
```
Dashboard.jsx
    │
    ├── useAulas() ──────────────────────► useFetch('/api/aulas')
    │                                            │
    │                                            ▼
    │                                      apiClient (axios)
    │                                            │
    │                                            ▼
    │                                      API_URL (apiConfig.js)
    │                                            │
    │                                            ▼
    │                                      JSON-Server (server.js)
    │                                            │
    │                                            ▼
    │                                      db.json (aulas)
    │
    └── useContenedores() ───────────────► useFetch('/api/contenedores')
                                             │
                                             ▼
                                       [Mismo flujo]
```

#### Alerts → API Service → API Client → Servidor
```
Alerts.jsx
    │
    ├── getAlerts() ──────────────────────► request('/api/alerts')
    │    (alertsApi.js)                         │
    │                                            ▼
    │                                      apiClient (fetch)
    │                                      (services/apiClient.js)
    │                                            │
    │                                            ▼
    │                                      API_URL (apiConfig.js)
    │                                            │
    │                                            ▼
    │                                      JSON-Server (server.js)
    │                                            │
    │                                            ▼
    │                                      db.json (alerts)
    │
    └── resolveAlert(id) ────────────────► PATCH /api/alerts/:id/resolve
```

---

## 4. Datos en db.json

El archivo `db.json` contiene las siguientes colecciones:

| Colección | Descripción |
|-----------|-------------|
| `users` | Usuarios del sistema (gestores de limpieza). Campos: id, name, role, email, password, assigned_sections |
| `aulas` | Aulas del colegio. Campos: id, name, cubos_por_dia (array con día, cubos_basura, cubos_reciclables), total_cubos_semana, gestor_id |
| `contenedores` | Contenedores de residuos. Campos: id, name, ubicacion, capacidad_max, nivel_actual, depositos_por_aula, ultima_vaciada |
| `alerts` | Alertas del sistema. Campos: id, title, message, severity, createdAt, resolved |

---

## 5. Endpoints de la API (JSON-Server)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/aulas` | Obtener todas las aulas |
| GET | `/api/aulas/:id` | Obtener un aula específica |
| POST | `/api/aulas` | Crear una nueva aula |
| PUT | `/api/aulas/:id` | Actualizar un aula |
| DELETE | `/api/aulas/:id` | Eliminar un aula |
| GET | `/api/contenedores` | Obtener todos los contenedores |
| GET | `/api/contenedores/:id` | Obtener un contenedor específico |
| POST | `/api/contenedores` | Crear un nuevo contenedor |
| PUT | `/api/contenedores/:id` | Actualizar un contenedor |
| DELETE | `/api/contenedores/:id` | Eliminar un contenedor |
| GET | `/api/alerts` | Obtener todas las alertas |
| GET | `/api/users` | Obtener todos los usuarios |
| GET | `/api/users/:id` | Obtener un usuario específico |

### Endpoints Personalizados (definidos en server.js)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/alerts` | Obtener todas las alertas (custom) |
| PATCH | `/api/alerts/:id/resolve` | Marcar una alerta como resuelta |

---

## 6. Scripts Disponibles (package.json)

| Script | Comando | Descripción |
|--------|---------|-------------|
| `npm run dev` | `vite` | Inicia el servidor de desarrollo de Vite |
| `npm run build` | `vite build` | Construye la aplicación para producción |
| `npm run preview` | `vite preview` | Previsualiza la aplicación construida |
| `npm run server` | `node server.js` | Inicia el servidor JSON-Server |
| `npm run dev:full` | `start /B node server.cjs && vite` | Inicia ambos servidores (Vite + JSON-Server) en Windows |
| `npm run lint` | `eslint .` | Ejecuta ESLint para verificar código |

---

## 7. Variables de Entorno

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `VITE_API_URL` | URL base de la API | `http://localhost:3000` |
| `VITE_USE_MOCK` | Habilitar modo mock en alertas | `true` |

---

## 8. Tecnologías Utilizadas

- **React 19** - Biblioteca de UI
- **Vite 7** - Herramienta de construcción y servidor de desarrollo
- **React Router DOM 7** - Enrutamiento
- **Axios** - Cliente HTTP (para hooks useFetch)
- **Fetch API** - Cliente HTTP alternativo (para alerts)
- **JSON-Server** - Servidor REST falso con datos en JSON
- **Recharts** - Biblioteca de gráficos
- **ESLint** - Linting de código

---

## 9. Códigos de Tareas (TK)

Las tareas del proyecto están identificadas con códigos:

| Código | Descripción |
|--------|-------------|
| TK-001-01 | Componente AulaCard |
| TK-001-02 | Componente ContenedorCard |
| TK-001-03 | Componente AulaList |
| TK-001-04 | Componente ContenedorList |
| TK-001-05 | Endpoints API |
| TK-001-06 | Hook useAulas |
| TK-001-07 | Hook useContenedores |
| TK-001-08 | ModalAula |
| TK-001-09 | ModalContenedor |
| TK-001-10 | Integración en Dashboard |
| TK-001-11 | Lógica de refresco automático tras CRUD |
| TK-001-12 | Barra de progreso visual y colores por nivel |
| TK-001-13 | Paleta de colores y jerarquía tipográfica |

---

## 10. Notas para Programadores

### Cambio de URL de API
Para cambiar la URL de la API (por ejemplo, para usar una API de producción), modificar el archivo:
```
src/composables/apiConfig.js
```
Cambiar:
```js
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```
Por:
```js
export const API_URL = 'https://mi-api-produccion.com';
```

### Datos Persistentes
Los datos se guardan automáticamente en `db.json` cuando se realizan operaciones CRUD desde el Dashboard. El servidor JSON-Server debe estar ejecutándose para que los cambios se persistan.

### Modo Mock en Alertas
La página de alertas (`Alerts.jsx`) tiene un flag `USE_MOCK` que permite simular diferentes escenarios (éxito, vacío, error) cuando está habilitado.

### Arquitectura de Componentes
Los componentes siguen un patrón de presentación (componentes puros que reciben props) combinados con hooks que manejan la lógica de negocio y estado. Los modales son genéricos y se reutilizan tanto para crear como para editar entidades.
