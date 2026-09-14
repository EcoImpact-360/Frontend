import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { login } from '../services/authApi';
import Login from '../pages/Login';
vi.mock('../services/authApi');
function renderPage() {
    return render(
        <MemoryRouter>
            <AuthProvider>
                <Login />
            </AuthProvider>
        </MemoryRouter>
    );
}
describe('Login Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });
    test('debe mostrar el formulario de inicio de sesion', () => {
        renderPage();
        expect(screen.getByText('Iniciar sesión')).toBeInTheDocument();
        expect(screen.getByLabelText('Nombre del colegio')).toBeInTheDocument();
        expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
    });
    test('debe mostrar error si faltan campos', async () => {
        renderPage();
        fireEvent.click(screen.getByRole('button', { name: /Entrar/i }));
        expect(await screen.findByText(/Escribe el nombre del colegio y la contraseña/i)).toBeInTheDocument();
        expect(login).not.toHaveBeenCalled();
    });
    test('debe iniciar sesion con credenciales validas', async () => {
        login.mockResolvedValue({ token: 'a-token', schoolId: 1, schoolName: 'Colegio Central' });
        renderPage();
        fireEvent.change(screen.getByLabelText('Nombre del colegio'), { target: { value: 'Colegio Central' } });
        fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'secreta123' } });
        fireEvent.click(screen.getByRole('button', { name: /Entrar/i }));
        await waitFor(() => {
            expect(login).toHaveBeenCalledWith('Colegio Central', 'secreta123');
        });
    });
    test('debe mostrar error si las credenciales son invalidas', async () => {
        login.mockRejectedValue({ message: 'Colegio o contraseña incorrectos' });
        renderPage();
        fireEvent.change(screen.getByLabelText('Nombre del colegio'), { target: { value: 'Colegio Central' } });
        fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'mala' } });
        fireEvent.click(screen.getByRole('button', { name: /Entrar/i }));
        expect(await screen.findByText('Colegio o contraseña incorrectos')).toBeInTheDocument();
    });
});
