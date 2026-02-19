// Converts Axios/network errors into user-friendly Spanish messages.
export const handleApiError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    switch (status) {
      case 400:
        return data.message || 'Solicitud inválida';
      case 401:
        return 'No autorizado. Por favor, inicia sesión nuevamente.';
      case 403:
        return 'Acceso denegado';
      case 404:
        return 'Recurso no encontrado';
      case 500:
        return 'Error del servidor. Intenta más tarde.';
      default:
        return data.message || 'Ocurrió un error';
    }
  }
  if (error.request) {
    return 'No se pudo conectar con el servidor';
  }
  return error.message || 'Error desconocido';
};

// Builds a URL query string from an object, skipping empty values.
export const buildQueryString = (params) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, value);
    }
  });
  return searchParams.toString();
};

// Checks whether an HTTP status code is in the successful range.
export const isSuccessfulResponse = (status) => {
  return status >= 200 && status < 300;
};

// Returns authorization headers when a token exists in localStorage.
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};
