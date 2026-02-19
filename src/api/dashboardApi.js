import apiClient from './apiClient';

export const dashboardApi = {
  // Fetches the full aulas collection.
  getAulas: async () => {
    const response = await apiClient.get('/aulas');
    return response.data;
  },

  // Fetches the full contenedores collection.
  getContenedores: async () => {
    const response = await apiClient.get('/contenedores');
    return response.data;
  },

  // Fetches one aula by its id.
  getAulaById: async (id) => {
    const response = await apiClient.get(`/aulas/${id}`);
    return response.data;
  },

  // Fetches one contenedor by its id.
  getContenedorById: async (id) => {
    const response = await apiClient.get(`/contenedores/${id}`);
    return response.data;
  },

  // Creates a new aula record.
  createAula: async (data) => {
    const response = await apiClient.post('/aulas', data);
    return response.data;
  },

  // Updates an existing aula record.
  updateAula: async (id, data) => {
    const response = await apiClient.put(`/aulas/${id}`, data);
    return response.data;
  },

  // Deletes an aula by id.
  deleteAula: async (id) => {
    const response = await apiClient.delete(`/aulas/${id}`);
    return response.data;
  },

  // Creates a new contenedor record.
  createContenedor: async (data) => {
    const response = await apiClient.post('/contenedores', data);
    return response.data;
  },

  // Updates an existing contenedor record.
  updateContenedor: async (id, data) => {
    const response = await apiClient.put(`/contenedores/${id}`, data);
    return response.data;
  },

  // Deletes a contenedor by id.
  deleteContenedor: async (id) => {
    const response = await apiClient.delete(`/contenedores/${id}`);
    return response.data;
  },

  // Computes top-level dashboard KPI values from aulas and contenedores.
  getMetrics: async () => {
    const [aulas, contenedores] = await Promise.all([
      dashboardApi.getAulas(),
      dashboardApi.getContenedores(),
    ]);

    const totalCubosSemana = aulas.reduce((sum, aula) => sum + (aula.total_cubos_semana || 0), 0);
    const totalReciclables = aulas.reduce((sum, aula) => {
      return sum + aula.cubos_por_dia.reduce((s, d) => s + (d.cubos_reciclables || 0), 0);
    }, 0);
    const totalBasura = aulas.reduce((sum, aula) => {
      return sum + aula.cubos_por_dia.reduce((s, d) => s + (d.cubos_basura || 0), 0);
    }, 0);
    const capacidadTotal = contenedores.reduce((sum, c) => sum + (c.capacidad_max || 0), 0);
    const nivelActual = contenedores.reduce((sum, c) => sum + (c.nivel_actual || 0), 0);

    return {
      totalCubosSemana,
      totalReciclables,
      totalBasura,
      totalAulas: aulas.length,
      totalContenedores: contenedores.length,
      nivelPromedio: capacidadTotal > 0 ? Math.round((nivelActual / capacidadTotal) * 100) : 0,
    };
  },

  // Transforms aulas into chart-friendly totals by classroom.
  getAulasData: async () => {
    const aulas = await dashboardApi.getAulas();
    return aulas.map(aula => ({
      name: aula.name,
      basura: aula.cubos_por_dia.reduce((s, d) => s + (d.cubos_basura || 0), 0),
      reciclables: aula.cubos_por_dia.reduce((s, d) => s + (d.cubos_reciclables || 0), 0),
    }));
  },

  // Transforms contenedores into chart-friendly capacity and level data.
  getContenedoresData: async () => {
    const contenedores = await dashboardApi.getContenedores();
    return contenedores.map(c => ({
      name: c.name,
      nivel: c.nivel_actual,
      capacidad: c.capacidad_max,
    }));
  },
};

export default dashboardApi;
