import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { SESSION_CLEARED_EVENT } from '../services/authStorage';
function Probe() {
    const { isAuthenticated, school } = useAuth();
    return <div>{isAuthenticated ? `logged-in:${school?.name}` : 'logged-out'}</div>;
}
describe('AuthContext', () => {
    beforeEach(() => {
        localStorage.clear();
    });
    test('arranca sin sesion si no hay nada guardado', () => {
        render(
            <AuthProvider>
                <Probe />
            </AuthProvider>
        );
        expect(screen.getByText('logged-out')).toBeInTheDocument();
    });
    test('arranca con sesion si ya hay token guardado', () => {
        localStorage.setItem('ecoimpact_token', 'a-token');
        localStorage.setItem('ecoimpact_school', JSON.stringify({ id: 1, name: 'Colegio Central' }));
        render(
            <AuthProvider>
                <Probe />
            </AuthProvider>
        );
        expect(screen.getByText('logged-in:Colegio Central')).toBeInTheDocument();
    });
    test('se desloguea sola si algo dispara el evento de sesion invalidada (ej. un 401)', () => {
        localStorage.setItem('ecoimpact_token', 'a-token');
        localStorage.setItem('ecoimpact_school', JSON.stringify({ id: 1, name: 'Colegio Central' }));
        render(
            <AuthProvider>
                <Probe />
            </AuthProvider>
        );
        expect(screen.getByText('logged-in:Colegio Central')).toBeInTheDocument();
        act(() => {
            window.dispatchEvent(new Event(SESSION_CLEARED_EVENT));
        });
        expect(screen.getByText('logged-out')).toBeInTheDocument();
    });
});
