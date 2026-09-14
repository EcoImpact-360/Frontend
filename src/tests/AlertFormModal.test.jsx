import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AlertFormModal from '../components/alerts/AlertFormModal';
const classrooms = [{ id: 1, name: 'Aula 1A' }, { id: 2, name: 'Aula 2B' }];
const wasteTypes = [{ id: 5, name: 'Plastico' }];
describe('AlertFormModal Component', () => {
  test('no renderiza nada si open es false', () => {
    render(<AlertFormModal open={false} onClose={vi.fn()} onSubmit={vi.fn()} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
  test('en modo creacion muestra los selects de aula y tipo de residuo', () => {
    render(
      <AlertFormModal open mode="create" classrooms={classrooms} wasteTypes={wasteTypes} onClose={vi.fn()} onSubmit={vi.fn()} />
    );
    expect(screen.getByText('Nueva alerta')).toBeInTheDocument();
    expect(screen.getByLabelText('Aula')).toBeInTheDocument();
    expect(screen.getByLabelText('Tipo de residuo (opcional)')).toBeInTheDocument();
    expect(screen.getByText('Aula 1A')).toBeInTheDocument();
  });
  test('en modo edicion no muestra los selects de aula ni tipo de residuo y precarga los valores', () => {
    render(
      <AlertFormModal
        open
        mode="edit"
        initialValues={{ classroomId: 1, wasteTypeId: 5, title: 'Titulo previo', message: 'Mensaje previo', totalKg: 4 }}
        classrooms={classrooms}
        wasteTypes={wasteTypes}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    );
    expect(screen.getByText('Editar alerta')).toBeInTheDocument();
    expect(screen.queryByLabelText('Aula')).not.toBeInTheDocument();
    expect(screen.getByDisplayValue('Titulo previo')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Mensaje previo')).toBeInTheDocument();
    expect(screen.getByDisplayValue('4')).toBeInTheDocument();
  });
  test('muestra error si se intenta crear sin seleccionar aula', async () => {
    const onSubmit = vi.fn();
    render(
      <AlertFormModal open mode="create" classrooms={classrooms} wasteTypes={wasteTypes} onClose={vi.fn()} onSubmit={onSubmit} />
    );
    fireEvent.change(screen.getByLabelText('Titulo'), { target: { value: 'Aviso manual' } });
    fireEvent.click(screen.getByRole('button', { name: /Crear alerta/i }));
    expect(await screen.findByText('Selecciona un aula para la alerta.')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
  test('muestra error si el titulo esta vacio', async () => {
    const onSubmit = vi.fn();
    render(
      <AlertFormModal open mode="create" classrooms={classrooms} wasteTypes={wasteTypes} onClose={vi.fn()} onSubmit={onSubmit} />
    );
    fireEvent.change(screen.getByLabelText('Aula'), { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button', { name: /Crear alerta/i }));
    expect(await screen.findByText(/titulo de la alerta es obligatorio/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
  test('envia el payload correcto al crear una alerta', async () => {
    const onSubmit = vi.fn().mockResolvedValue();
    render(
      <AlertFormModal open mode="create" classrooms={classrooms} wasteTypes={wasteTypes} onClose={vi.fn()} onSubmit={onSubmit} />
    );
    fireEvent.change(screen.getByLabelText('Aula'), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText('Tipo de residuo (opcional)'), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText('Titulo'), { target: { value: 'Aviso manual' } });
    fireEvent.change(screen.getByLabelText('Mensaje (opcional)'), { target: { value: 'Revisar el aula' } });
    fireEvent.change(screen.getByLabelText('Cantidad en kg (opcional)'), { target: { value: '3.5' } });
    fireEvent.click(screen.getByRole('button', { name: /Crear alerta/i }));
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        classroomId: 2,
        wasteTypeId: 5,
        title: 'Aviso manual',
        message: 'Revisar el aula',
        totalKg: 3.5,
        alertType: 'CUSTOM',
      });
    });
  });
  test('envia solo los campos editables al actualizar una alerta', async () => {
    const onSubmit = vi.fn().mockResolvedValue();
    render(
      <AlertFormModal
        open
        mode="edit"
        initialValues={{ classroomId: 1, title: 'Titulo previo', message: '', totalKg: null }}
        classrooms={classrooms}
        wasteTypes={wasteTypes}
        onClose={vi.fn()}
        onSubmit={onSubmit}
      />
    );
    fireEvent.change(screen.getByLabelText('Titulo'), { target: { value: 'Titulo nuevo' } });
    fireEvent.click(screen.getByRole('button', { name: /Guardar cambios/i }));
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ title: 'Titulo nuevo', message: null, totalKg: null });
    });
  });
  test('muestra el error devuelto por onSubmit y no cierra el modal', async () => {
    const onSubmit = vi.fn().mockRejectedValue({ message: 'No se pudo guardar' });
    render(
      <AlertFormModal open mode="create" classrooms={classrooms} wasteTypes={wasteTypes} onClose={vi.fn()} onSubmit={onSubmit} />
    );
    fireEvent.change(screen.getByLabelText('Aula'), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText('Titulo'), { target: { value: 'Aviso manual' } });
    fireEvent.click(screen.getByRole('button', { name: /Crear alerta/i }));
    expect(await screen.findByText('No se pudo guardar')).toBeInTheDocument();
  });
  test('llama a onClose al hacer clic en "Cancelar"', () => {
    const onClose = vi.fn();
    render(
      <AlertFormModal open mode="create" classrooms={classrooms} wasteTypes={wasteTypes} onClose={onClose} onSubmit={vi.fn()} />
    );
    fireEvent.click(screen.getByRole('button', { name: /Cancelar/i }));
    expect(onClose).toHaveBeenCalled();
  });
});
