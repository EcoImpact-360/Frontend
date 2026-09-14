import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Alerts from '../pages/Alerts';
import { getAlerts, resolveAlert, createAlert, updateAlert, deleteAlert } from '../services/alertsApi';
import { getClassrooms, getWasteTypes } from '../services/catalogApi';
vi.mock('../services/alertsApi');
vi.mock('../services/catalogApi');
const sampleAlert = {
  id: 1,
  title: 'Umbral de residuos superado',
  message: 'Plastico — 12 kg',
  severity: 'high',
  category: 'Plastico',
  location: 'Aula 1A',
  createdAt: '2026-02-19T08:00:00.000Z',
  resolved: false,
  classroomId: 1,
  wasteTypeId: 5,
};
function renderAlerts() {
  return render(
    <MemoryRouter>
      <Alerts />
    </MemoryRouter>
  );
}
describe('Alerts Page - CRUD manual de alertas', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getAlerts.mockResolvedValue([sampleAlert]);
    getClassrooms.mockResolvedValue([{ id: 1, name: 'Aula 1A' }]);
    getWasteTypes.mockResolvedValue([{ id: 5, name: 'Plastico' }]);
    resolveAlert.mockResolvedValue({ id: 1, resolved: true });
  });
  test('abre el formulario de creacion al pulsar "Nueva alerta" y crea la alerta', async () => {
    createAlert.mockResolvedValue({ ...sampleAlert, id: 2, title: 'Aviso manual' });
    renderAlerts();
    await screen.findByText(sampleAlert.title);
    fireEvent.click(screen.getByRole('button', { name: /Nueva alerta/i }));
    expect(await screen.findByRole('dialog', { name: /Crear alerta/i })).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Aula'), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText('Titulo'), { target: { value: 'Aviso manual' } });
    fireEvent.click(screen.getByRole('button', { name: /^Crear alerta$/i }));
    await waitFor(() => {
      expect(createAlert).toHaveBeenCalledWith(
        expect.objectContaining({ classroomId: 1, title: 'Aviso manual' })
      );
    });
    expect(getAlerts).toHaveBeenCalledTimes(2);
  });
  test('abre el formulario de edicion precargado y guarda los cambios', async () => {
    updateAlert.mockResolvedValue({ ...sampleAlert, title: 'Titulo editado' });
    renderAlerts();
    await screen.findByText(sampleAlert.title);
    fireEvent.click(screen.getByRole('button', { name: /Editar/i }));
    expect(await screen.findByRole('dialog', { name: /Editar alerta/i })).toBeInTheDocument();
    expect(screen.getByDisplayValue(sampleAlert.title)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Titulo'), { target: { value: 'Titulo editado' } });
    fireEvent.click(screen.getByRole('button', { name: /Guardar cambios/i }));
    await waitFor(() => {
      expect(updateAlert).toHaveBeenCalledWith(1, expect.objectContaining({ title: 'Titulo editado' }));
    });
  });
  test('pide confirmacion y elimina la alerta', async () => {
    deleteAlert.mockResolvedValue({ id: 1 });
    renderAlerts();
    await screen.findByText(sampleAlert.title);
    fireEvent.click(screen.getByRole('button', { name: /Eliminar/i }));
    const dialog = await screen.findByRole('dialog', { name: /Confirmar eliminacion/i });
    fireEvent.click(within(dialog).getByRole('button', { name: /^Eliminar$/i }));
    await waitFor(() => {
      expect(deleteAlert).toHaveBeenCalledWith(1);
    });
  });
});
