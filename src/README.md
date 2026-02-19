# Hooks y Utils

## Hooks

### useFetch

Hook genérico para realizar peticiones HTTP.

```javascript
import useFetch from './hooks/useFetch';

const { data, loading, error, refetch } = useFetch('/endpoint', {
  method: 'GET', // POST, PUT, DELETE, etc.
  body: null, // Datos a enviar (para POST/PUT)
  dependencies: [], // Dependencias que provocan re-fetch
});
```

**Retorna:**
- `data`: Datos de la respuesta
- `loading`: Booleano indicando si está cargando
- `error`: Mensaje de error si falla
- `refetch`: Función para volver a ejecutar la petición

## Utils

### formatters.js

Funciones de formateo:
- `formatDate(date, options)` - Formatea fechas
- `formatCurrency(amount, currency)` - Formatea moneda
- `formatNumber(number, decimals)` - Formatea números
- `formatPercentage(value, decimals)` - Formatea porcentajes
- `formatRelativeTime(date)` - Tiempo relativo ("Hace 2 horas")

### apiHelpers.js

Utilidades para API:
- `handleApiError(error)` - Manejo de errores
- `buildQueryString(params)` - Construye query string
- `isSuccessfulResponse(status)` - Verifica respuesta exitosa
- `getAuthHeaders()` - Obtiene headers de auth
