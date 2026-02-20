import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { dashboardApi } from '../api/dashboardApi';
import Dashboard from '../pages/Dashboard';

vi.mock('../api/dashboardApi');

vi.mock('../components/metrics/BarChartComponent', () => ({
    default: () => <div data-testid="mock-chart">Gráfico</div>
}));

describe('Dashboard Component', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('debe mostrar el estado de carga inicialmente', () => {
        dashboardApi.getMetrics.mockReturnValue(new Promise(() => { }));

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

        const toastError = await screen.findByText(errorMsg);
        expect(toastError).toBeInTheDocument();
    });

    test('debe tener un enlace funcional para volver al inicio', async () => {
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

        const link = await screen.findByRole('link', { name: /Volver al Inicio/i });
        expect(link).toHaveAttribute('href', '/');
    });
});