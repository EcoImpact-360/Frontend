const DEFAULT_TIMEOUT_MS = 10000;
const BASE_URL = "http://localhost:8080/api/v1";

function normalizeError(err, context) {
  if (err && typeof err === "object" && "status" in err && "code" in err) {
    return err;
  }

  if (err && err.name === "AbortError") {
    return {
      status: 0,
      code: "TIMEOUT",
      message: "La solicitud tardó demasiado. Intenta de nuevo.",
      details: context,
    };
  }

  if (err instanceof TypeError) {
    return {
      status: 0,
      code: "NETWORK",
      message: "No hay conexión o el servidor no responde (Verifica si el Backend está encendido).",
      details: context,
    };
  }

  return {
    status: 0,
    code: "UNKNOWN",
    message: "Error inesperado",
    details: context,
  };
}

/**
 * @param {string} path 
 * @param {object} options 
 */
export async function request(path, options = {}) {
  const {
    method = "GET",
    headers = {},
    body,
    timeout = DEFAULT_TIMEOUT_MS,
  } = options;

  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const finalHeaders = {
    "Accept": "application/json",
    ...headers,
  };

  let payload = body;
  const hasBody = body !== undefined && body !== null;
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  if (hasBody && !isFormData && typeof body === "object") {
    payload = JSON.stringify(body);
    if (!finalHeaders["Content-Type"]) {
      finalHeaders["Content-Type"] = "application/json";
    }
  }

  const context = { url, method };
  if (hasBody) context.body = body;

  try {
    const response = await fetch(url, {
      method,
      headers: finalHeaders,
      body: hasBody ? payload : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const text = await response.text();
    let data = null;

    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text; 
      }
    }

    if (response.ok) {
      return data;
    }

    const message = data && typeof data === "object" ? (data.message || data.error) : "Error en la petición";

    throw {
      status: response.status,
      code: `HTTP_${response.status}`,
      message,
      details: {
        ...context,
        responseText: text || undefined,
      },
    };
  } catch (err) {
    throw normalizeError(err, context);
  } finally {
    clearTimeout(timeoutId);
  }
}