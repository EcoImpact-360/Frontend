import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { getClassrooms, getWasteTypes } from '../services/catalogApi';
import { createWasteEntry } from '../services/wasteEntriesApi';
import RegisterWaste from '../pages/RegisterWaste';
vi.mock('../services/catalogApi');
vi.mock('../services/wasteEntriesApi');
describe('RegisterWaste Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        getClassrooms.mockResolvedValue([{ id: 1, name: 'Aula 1A' }]);
        getWasteTypes.mockResolvedValue([{ id: 2, name: 'Plastico' }]);
    });
    test('debe mostrar el formulario con las aulas y tipos cargados', async () => {
        render(
            <MemoryRouter>
                <RegisterWaste />
            </MemoryRouter>
        );
        expect(await screen.findByText('Aula 1A')).toBeInTheDocument();
        expect(screen.getByText('Plastico')).toBeInTheDocument();
    });
    test('debe mostrar un error si se envia sin completar el formulario', async () => {
        render(
            <MemoryRouter>
                <RegisterWaste />
            </MemoryRouter>
        );
        await screen.findByText('Aula 1A');
        fireEvent.click(screen.getByRole('button', { name: /Registrar/i }));
        expect(await screen.findByText(/Completa aula, tipo de residuo y cantidad/i)).toBeInTheDocument();
        expect(createWasteEntry).not.toHaveBeenCalled();
    });
    test('debe registrar el residuo y mostrar el impacto calculado', async () => {
        createWasteEntry.mockResolvedValue({ co2Kg: 5, waterSaved: 10, treesEquivalent: 0.25 });
        render(
            <MemoryRouter>
                <RegisterWaste />
            </MemoryRouter>
        );
        await screen.findByText('Aula 1A');
        fireEvent.change(screen.getByLabelText('Aula'), { target: { value: '1' } });
        fireEvent.change(screen.getByLabelText('Tipo de residuo'), { target: { value: '2' } });
        fireEvent.change(screen.getByLabelText('Cantidad (kg)'), { target: { value: '3' } });
        fireEvent.click(screen.getByRole('button', { name: /Registrar/i }));
        await waitFor(() => {
            expect(createWasteEntry).toHaveBeenCalledWith({ classroomId: 1, wasteTypeId: 2, quantityKg: 3 });
        });
        expect(await screen.findByText('Impacto de este registro')).toBeInTheDocument();
    });
    test('debe bloquear el registro si no hay ningun colegio/aula registrados', async () => {
        getClassrooms.mockResolvedValue([]);
        render(
            <MemoryRouter>
                <RegisterWaste />
            </MemoryRouter>
        );
        expect(await screen.findByText(/Todavia no hay ningun colegio ni aula registrados/i)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Registrar Colegio/i })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /^Registrar$/i })).not.toBeInTheDocument();
    });
});
