import { render, screen } from '@testing-library/react';
import MetricCard from '../components/metrics/MetricCard';
import * as formatters from '../utils/formatters'; 


vi.mock('../utils/formatters', () => ({
  formatCurrency: vi.fn((val) => `$${val}`),
  formatNumber: vi.fn((val) => `${val}`),
  formatPercentage: vi.fn((val) => `${val}%`),
}));

describe('MetricCard Component', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('debe renderizar el título y el valor formateado correctamente', () => {
    render(<MetricCard title="Peso Total" value={150} />);
    
    expect(screen.getByText('Peso Total')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
    expect(formatters.formatNumber).toHaveBeenCalledWith(150);
  });

  test('debe mostrar la tendencia y aplicar la clase CSS de subida', () => {
    render(<MetricCard title="Crecimiento" value={10} trend={5.2} />);
    
    const trendElement = screen.getByText(/UP 5.2%/);
    expect(trendElement).toBeInTheDocument();
    expect(trendElement).toHaveClass('metric-card__trend--up');
  });

  test('debe mostrar la tendencia y aplicar la clase CSS de bajada', () => {
    render(<MetricCard title="Descenso" value={10} trend={-3} />);
    
    const trendElement = screen.getByText(/DOWN 3%/);
    expect(trendElement).toBeInTheDocument();
    expect(trendElement).toHaveClass('metric-card__trend--down');
  });

  test('debe mostrar la unidad junto al valor si existe', () => {
    render(<MetricCard title="Carga" value={80} unit="kg" />);
    expect(screen.getByText(/80 kg/)).toBeInTheDocument();
  });

  test('debe renderizar el icono proporcionado', () => {
    render(<MetricCard title="Icon Test" value={0} icon="📊" />);
    expect(screen.getByText('📊')).toBeInTheDocument();
  });
});