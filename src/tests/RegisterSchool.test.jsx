import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { getSchools, createSchool } from '../services/schoolsApi';
import { createClassroom } from '../services/catalogApi';
import RegisterSchool from '../pages/RegisterSchool';
vi.mock('../services/schoolsApi');
vi.mock('../services/catalogApi');
describe('RegisterSchool Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        getSchools.mockResolvedValue([{ id: 1, name: 'IES EcoImpact', city: 'Barcelona' }]);
    });
    test('debe mostrar el listado de colegios cargado', async () => {
        render(
            <MemoryRouter>
                <RegisterSchool />
            </MemoryRouter>
        );
        expect(await screen.findByText('IES EcoImpact')).toBeInTheDocument();
    });
    test('debe registrar un colegio nuevo', async () => {
        createSchool.mockResolvedValue({ id: 2, name: 'Colegio Nuevo', city: 'Madrid' });
        render(
            <MemoryRouter>
                <RegisterSchool />
            </MemoryRouter>
        );
        await screen.findByText('IES EcoImpact');
        fireEvent.change(screen.getByLabelText('Nombre del colegio'), { target: { value: 'Colegio Nuevo' } });
        fireEvent.change(screen.getByLabelText('Ciudad'), { target: { value: 'Madrid' } });
        fireEvent.click(screen.getByRole('button', { name: /Registrar Colegio/i }));
        await waitFor(() => {
            expect(createSchool).toHaveBeenCalledWith({ name: 'Colegio Nuevo', city: 'Madrid' });
        });
        expect(await screen.findByText(/registrado correctamente/i)).toBeInTheDocument();
    });
    test('debe anadir un aula a un colegio existente', async () => {
        createClassroom.mockResolvedValue({ id: 5, name: 'Aula Nueva' });
        render(
            <MemoryRouter>
                <RegisterSchool />
            </MemoryRouter>
        );
        await screen.findByText('IES EcoImpact');
        fireEvent.change(screen.getByLabelText('Colegio'), { target: { value: '1' } });
        fireEvent.change(screen.getByLabelText('Nombre del aula'), { target: { value: 'Aula Nueva' } });
        fireEvent.click(screen.getByRole('button', { name: /Anadir Aula/i }));
        await waitFor(() => {
            expect(createClassroom).toHaveBeenCalledWith({ name: 'Aula Nueva', schoolId: 1 });
        });
        expect(await screen.findByText(/anadida correctamente/i)).toBeInTheDocument();
    });
});
