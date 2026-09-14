import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { createSchool } from '../services/schoolsApi';
import { createClassroom } from '../services/catalogApi';
import { login } from '../services/authApi';
import RegisterSchool from '../pages/RegisterSchool';
vi.mock('../services/schoolsApi');
vi.mock('../services/catalogApi');
vi.mock('../services/authApi');
function renderPage() {
    return render(
        <MemoryRouter>
            <AuthProvider>
                <RegisterSchool />
            </AuthProvider>
        </MemoryRouter>
    );
}
describe('RegisterSchool Component (logged out)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });
    test('debe mostrar el formulario de registro de colegio', () => {
        renderPage();
        expect(screen.getByRole('heading', { name: 'Registrar Colegio' })).toBeInTheDocument();
        expect(screen.getByLabelText('Nombre del colegio')).toBeInTheDocument();
        expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
    });
    test('debe mostrar error si las contraseñas no coinciden', async () => {
        renderPage();
        fireEvent.change(screen.getByLabelText('Nombre del colegio'), { target: { value: 'Colegio Nuevo' } });
        fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'secreta123' } });
        fireEvent.change(screen.getByLabelText('Repetir contraseña'), { target: { value: 'otra-cosa' } });
        fireEvent.click(screen.getByRole('button', { name: /Registrar Colegio/i }));
        expect(await screen.findByText(/no coinciden/i)).toBeInTheDocument();
        expect(createSchool).not.toHaveBeenCalled();
    });
    test('debe registrar el colegio e iniciar sesion automaticamente', async () => {
        createSchool.mockResolvedValue({ id: 1, name: 'Colegio Nuevo', city: 'Madrid' });
        login.mockResolvedValue({ token: 'a-token', schoolId: 1, schoolName: 'Colegio Nuevo' });
        renderPage();
        fireEvent.change(screen.getByLabelText('Nombre del colegio'), { target: { value: 'Colegio Nuevo' } });
        fireEvent.change(screen.getByLabelText('Ciudad'), { target: { value: 'Madrid' } });
        fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'secreta123' } });
        fireEvent.change(screen.getByLabelText('Repetir contraseña'), { target: { value: 'secreta123' } });
        fireEvent.click(screen.getByRole('button', { name: /Registrar Colegio/i }));
        await waitFor(() => {
            expect(createSchool).toHaveBeenCalledWith({ name: 'Colegio Nuevo', city: 'Madrid', password: 'secreta123' });
        });
        await waitFor(() => {
            expect(login).toHaveBeenCalledWith('Colegio Nuevo', 'secreta123');
        });
    });
});
describe('RegisterSchool Component (logged in)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        localStorage.setItem('ecoimpact_token', 'a-token');
        localStorage.setItem('ecoimpact_school', JSON.stringify({ id: 1, name: 'Colegio Nuevo' }));
    });
    test('debe mostrar el formulario de anadir aula, sin selector de colegio', () => {
        renderPage();
        expect(screen.getByRole('heading', { name: 'Añadir Aula' })).toBeInTheDocument();
        expect(screen.getByLabelText('Nombre del aula')).toBeInTheDocument();
        expect(screen.queryByLabelText('Colegio')).not.toBeInTheDocument();
    });
    test('debe anadir un aula al colegio conectado', async () => {
        createClassroom.mockResolvedValue({ id: 5, name: 'Aula Nueva' });
        renderPage();
        fireEvent.change(screen.getByLabelText('Nombre del aula'), { target: { value: 'Aula Nueva' } });
        fireEvent.click(screen.getByRole('button', { name: /Añadir Aula/i }));
        await waitFor(() => {
            expect(createClassroom).toHaveBeenCalledWith({ name: 'Aula Nueva' });
        });
        expect(await screen.findByText(/añadida correctamente/i)).toBeInTheDocument();
    });
});
