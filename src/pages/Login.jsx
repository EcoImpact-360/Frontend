import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/alerts/Toast';
function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name.trim() || !password) {
      setToast({ type: 'error', message: 'Escribe el nombre del colegio y la contraseña.' });
      return;
    }
    setSubmitting(true);
    try {
      await login(name.trim(), password);
      const redirectTo = location.state?.from?.pathname || '/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'No se pudo iniciar sesión.' });
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <main className="page-shell page-shell--narrow">
      <Toast type={toast?.type} message={toast?.message} onClose={() => setToast(null)} />
      <section className="surface-card home-hero">
        <h1 className="page-title">Iniciar sesión</h1>
        <p>Entra con el nombre de tu colegio y la contraseña que usaste al registrarlo.</p>
        <form className="alerts-toolbar" onSubmit={handleSubmit}>
          <div className="alerts-toolbar__controls" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <label className="alerts-field">
              <span>Nombre del colegio</span>
              <input
                className="alerts-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="username"
              />
            </label>
            <label className="alerts-field">
              <span>Contraseña</span>
              <input
                className="alerts-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </label>
          </div>
          <div className="alerts-toolbar__meta">
            <button type="submit" className="alerts-btn" disabled={submitting}>
              {submitting ? 'Entrando...' : 'Entrar'}
            </button>
            <span className="alerts-result-count">
              ¿No tienes colegio todavía? <Link to="/register-school">Regístralo aquí</Link>.
            </span>
          </div>
        </form>
      </section>
    </main>
  );
}
export default Login;
