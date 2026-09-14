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
  test('no debe mostrar los botones "Editar" ni "Eliminar" si no se pasan los handlers', () => {
    render(<AlertCard alert={mockAlert} />);
    expect(screen.queryByRole('button', { name: /Editar/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Eliminar/i })).not.toBeInTheDocument();
  });
  test('debe llamar a onEdit con la alerta al hacer clic en "Editar"', () => {
    const mockOnEdit = vi.fn();
    render(<AlertCard alert={mockAlert} onEdit={mockOnEdit} />);
    fireEvent.click(screen.getByRole('button', { name: /Editar/i }));
    expect(mockOnEdit).toHaveBeenCalledWith(mockAlert);
  });
  test('debe llamar a onDelete con la alerta al hacer clic en "Eliminar"', () => {
    const mockOnDelete = vi.fn();
    render(<AlertCard alert={mockAlert} onDelete={mockOnDelete} />);
    fireEvent.click(screen.getByRole('button', { name: /Eliminar/i }));
    expect(mockOnDelete).toHaveBeenCalledWith(mockAlert);
  });
  test('debe seguir mostrando "Editar" y "Eliminar" aunque la alerta ya este resuelta', () => {
    const resolvedAlert = { ...mockAlert, resolved: true };
    render(<AlertCard alert={resolvedAlert} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByRole('button', { name: /Editar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Eliminar/i })).toBeInTheDocument();
  });
});