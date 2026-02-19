const STORAGE_KEY = 'ecoimpact_alerts_v1';
const SIMULATED_DELAY_MS = 220;

const SEED_ALERTS = [
  {
    id: 'al-101',
    title: 'Contenedor Norte al 92%',
    message: 'El contenedor organico de Zona Norte esta cerca de su capacidad maxima.',
    severity: 'high',
    category: 'Capacidad',
    location: 'Zona Norte',
    assignedTo: 'Maria Lopez',
    createdAt: '2026-02-19T08:45:00.000Z',
    resolved: false,
    resolvedAt: null,
  },
  {
    id: 'al-102',
    title: 'Pico de consumo en Aula 1',
    message: 'Se detecto un incremento de consumo electrico por encima del umbral esperado.',
    severity: 'high',
    category: 'Energia',
    location: 'Aula 1',
    assignedTo: 'Juan Perez',
    createdAt: '2026-02-19T07:20:00.000Z',
    resolved: false,
    resolvedAt: null,
  },
  {
    id: 'al-103',
    title: 'Ruta de recoleccion incompleta',
    message: 'No se completo la recoleccion en el bloque B durante el turno de manana.',
    severity: 'medium',
    category: 'Operacion',
    location: 'Bloque B',
    assignedTo: 'Equipo Limpieza',
    createdAt: '2026-02-18T15:10:00.000Z',
    resolved: false,
    resolvedAt: null,
  },
  {
    id: 'al-104',
    title: 'Mantenimiento preventivo programado',
    message: 'El equipo de compactacion requiere revision preventiva esta semana.',
    severity: 'low',
    category: 'Mantenimiento',
    location: 'Patio Central',
    assignedTo: 'Soporte Tecnico',
    createdAt: '2026-02-18T12:30:00.000Z',
    resolved: false,
    resolvedAt: null,
  },
  {
    id: 'al-105',
    title: 'Separacion incorrecta en Aula 3',
    message: 'Se detectaron residuos organicos en contenedor de reciclaje.',
    severity: 'medium',
    category: 'Reciclaje',
    location: 'Aula 3',
    assignedTo: 'Maria Lopez',
    createdAt: '2026-02-17T10:05:00.000Z',
    resolved: false,
    resolvedAt: null,
  },
  {
    id: 'al-106',
    title: 'Meta diaria superada',
    message: 'La sede Sur supero el objetivo de reciclaje del dia.',
    severity: 'low',
    category: 'KPI',
    location: 'Sede Sur',
    assignedTo: 'Analitica',
    createdAt: '2026-02-17T09:00:00.000Z',
    resolved: true,
    resolvedAt: '2026-02-17T11:45:00.000Z',
  },
  {
    id: 'al-107',
    title: 'Sensor de peso intermitente',
    message: 'El sensor del contenedor principal reporta datos intermitentes.',
    severity: 'medium',
    category: 'Hardware',
    location: 'Patio Central',
    assignedTo: 'Soporte Tecnico',
    createdAt: '2026-02-16T16:40:00.000Z',
    resolved: true,
    resolvedAt: '2026-02-16T18:20:00.000Z',
  },
  {
    id: 'al-108',
    title: 'Demora en vaciado externo',
    message: 'El proveedor externo no realizo el vaciado en el horario pactado.',
    severity: 'high',
    category: 'Proveedor',
    location: 'Muelle de carga',
    assignedTo: 'Coordinacion',
    createdAt: '2026-02-15T14:00:00.000Z',
    resolved: false,
    resolvedAt: null,
  },
];

const clone = (value) => JSON.parse(JSON.stringify(value));

const delay = () => new Promise((resolve) => {
  setTimeout(resolve, SIMULATED_DELAY_MS);
});

function loadAlerts() {
  if (typeof window === 'undefined') {
    return clone(SEED_ALERTS);
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const initial = clone(SEED_ALERTS);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      throw new Error('INVALID_PAYLOAD');
    }
    return parsed;
  } catch {
    const initial = clone(SEED_ALERTS);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
}

function saveAlerts(alerts) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
  }
}

function sortByRecent(alerts) {
  return [...alerts].sort((a, b) => {
    const aTime = Date.parse(a.createdAt || 0);
    const bTime = Date.parse(b.createdAt || 0);
    return bTime - aTime;
  });
}

export async function getAlerts() {
  await delay();
  return sortByRecent(loadAlerts());
}

export async function resolveAlert(id) {
  await delay();

  const alerts = loadAlerts();
  const updatedAlerts = alerts.map((alert) => {
    if (String(alert.id) !== String(id)) {
      return alert;
    }

    return {
      ...alert,
      resolved: true,
      resolvedAt: new Date().toISOString(),
    };
  });

  saveAlerts(updatedAlerts);
  return updatedAlerts.find((alert) => String(alert.id) === String(id)) || null;
}
