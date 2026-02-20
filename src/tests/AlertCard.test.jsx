import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AlertCard from '../components/alerts/AlertCard'; 

vi.mock('./AlertBadge', () => ({
  default: ({ severity }) => <span data-testid="mock-badge">{severity}</span>
}));

describe('AlertCard Component', () => {
  const mockAlert = {
    id: 'al-101',
    title: 'Contenedor Norte al 92%',
    message: 'Capacidad máxima cerca',
    severity: 'high',
    category: 'Capacidad',
    location: 'Zona Norte',
    assignedTo: 'Maria Lopez',
    createdAt: '2026-02-19T08:45:00.000Z',
    resolved: false,
  };

  test('debe renderizar la información de la alerta correctamente', () => {
    render(<AlertCard alert={mockAlert} />);

    expect(screen.getByText(mockAlert.title)).toBeInTheDocument();
    expect(screen.getByText(mockAlert.message)).toBeInTheDocument();
    expect(screen.getByText(/Pendiente/i)).toBeInTheDocument();
    
    expect(screen.getByText(/Capacidad • Zona Norte • Maria Lopez/i)).toBeInTheDocument();
  });

  test('debe mostrar el botón "Resolver" cuando la alerta no está resuelta', () => {
    render(<AlertCard alert={mockAlert} />);
    const button = screen.getByRole('button', { name: /Resolver/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  test('no debe mostrar el botón "Resolver" si la alerta ya está resuelta', () => {
    const resolvedAlert = { ...mockAlert, resolved: true };
    render(<AlertCard alert={resolvedAlert} />);
    
    expect(screen.queryByRole('button', { name: /Resolver/i })).not.toBeInTheDocument();
    expect(screen.getByText(/Resuelta/i)).toBeInTheDocument();
  });

  test('debe llamar a onResolve y mostrar estado de carga al hacer clic', async () => {
    const mockOnResolve = vi.fn().mockImplementation(() => 
      new Promise((resolve) => setTimeout(resolve, 50))
    );

    render(<AlertCard alert={mockAlert} onResolve={mockOnResolve} />);
    
    const button = screen.getByRole('button', { name: /Resolver/i });
    fireEvent.click(button);

    expect(screen.getByText(/Procesando.../i)).toBeInTheDocument();
    expect(button).toBeDisabled();

    expect(mockOnResolve).toHaveBeenCalledWith(mockAlert);

    await waitFor(() => {
      expect(mockOnResolve).toHaveBeenCalledTimes(1);
    });
  });

  test('debe deshabilitar el botón si la prop "disabled" es true', () => {
    render(<AlertCard alert={mockAlert} disabled={true} />);
    const button = screen.getByRole('button', { name: /Resolver/i });
    expect(button).toBeDisabled();
  });

  test('debe formatear la fecha correctamente', () => {
    render(<AlertCard alert={mockAlert} />);
    expect(screen.getByText(/2026/)).toBeInTheDocument();
  });
});