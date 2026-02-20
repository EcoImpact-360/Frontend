import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { dashboardApi } from '../api/dashboardApi';
import Dashboard from '../pages/Dashboard';

// Mock de la API con Vitest
vi.mock('../api/dashboardApi');

// Mock del subcomponente de gráficos para evitar errores de renderizado de librerías externas
vi.mock('../components/metrics/BarChartComponent', () => ({
  default: () => <div data-testid="mock-chart">Gráfico</div>
}));

describe('Dashboard Component', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('debe mostrar el estado de carga inicialmente', () => {
    // Simulamos una promesa que no se resuelve para que se quede en estado "loading"
    dashboardApi.getMetrics.mockReturnValue(new Promise(() => {}));

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByText(/Cargando metricas reales/i)).toBeInTheDocument();
  });

  test('debe mostrar un mensaje de error si la API falla', async () => {
    const errorMsg = 'Error crítico del servidor';
    dashboardApi.getMetrics.mockRejectedValueOnce(new Error(errorMsg));

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    // Buscamos el mensaje de error que el componente captura en el bloque catch
    const toastError = await screen.findByText(errorMsg);
    expect(toastError).toBeInTheDocument();
  });

  test('debe tener un enlace funcional para volver al inicio', async () => {
    // Necesitamos que la API resuelva para que el componente salga del estado de carga
    dashboardApi.getMetrics.mockResolvedValueOnce({
      totalKgRecolectados: 0,
      rankingAulas: [],
      residuosPorCategoria: {}
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    // Verificamos que el link de navegación sea correcto
    const link = await screen.findByRole('link', { name: /Volver al Inicio/i });
    expect(link).toHaveAttribute('href', '/');
  });
});