import { render, screen, fireEvent } from '@testing-library/react';
import DeleteAlertModal from '../components/alerts/DeleteAlertModal';
describe('DeleteAlertModal Component', () => {
  const alert = { id: 1, title: 'Aviso manual' };
  test('no renderiza nada si open es false o no hay alerta', () => {
    const { rerender } = render(<DeleteAlertModal open={false} alert={alert} onConfirm={vi.fn()} onClose={vi.fn()} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    rerender(<DeleteAlertModal open alert={null} onConfirm={vi.fn()} onClose={vi.fn()} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
  test('muestra el titulo de la alerta a eliminar', () => {
    render(<DeleteAlertModal open alert={alert} onConfirm={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByText(/Aviso manual/)).toBeInTheDocument();
  });
  test('llama a onConfirm con el id de la alerta', () => {
    const onConfirm = vi.fn();
    render(<DeleteAlertModal open alert={alert} onConfirm={onConfirm} onClose={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /^Eliminar$/i }));
    expect(onConfirm).toHaveBeenCalledWith(1);
  });
  test('llama a onClose al cancelar', () => {
    const onClose = vi.fn();
    render(<DeleteAlertModal open alert={alert} onConfirm={vi.fn()} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: /Cancelar/i }));
    expect(onClose).toHaveBeenCalled();
  });
  test('deshabilita los botones mientras loading es true', () => {
    render(<DeleteAlertModal open alert={alert} onConfirm={vi.fn()} onClose={vi.fn()} loading />);
    expect(screen.getByRole('button', { name: /Cancelar/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /Eliminando/i })).toBeDisabled();
  });
});
