import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createSchool } from '../services/schoolsApi';
import { createClassroom } from '../services/catalogApi';
import Toast from '../components/alerts/Toast';
function RegisterSchoolForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name.trim() || !password) {
      setToast({ type: 'error', message: 'El nombre y la contraseña son obligatorios.' });
      return;
    }
    if (password.length < 6) {
      setToast({ type: 'error', message: 'La contraseña debe tener al menos 6 caracteres.' });
      return;
    }
    if (password !== confirmPassword) {
      setToast({ type: 'error', message: 'Las contraseñas no coinciden.' });
      return;
    }
    setSubmitting(true);
    try {
      await createSchool({ name: name.trim(), city: city.trim() || null, password });
      await login(name.trim(), password);
      navigate('/register-school', { replace: true });
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'No se pudo registrar el colegio.' });
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <main className="page-shell page-shell--narrow">
      <Toast type={toast?.type} message={toast?.message} onClose={() => setToast(null)} />
      <header className="page-header">
        <div>
          <h1 className="page-title">Registrar Colegio</h1>
          <p className="page-subtitle">Crea la cuenta de tu colegio para empezar a registrar residuos.</p>
        </div>
        <Link to="/login" className="alerts-btn-secondary link-btn">
          Ya tengo cuenta
        </Link>
      </header>
      <form className="surface-card alerts-toolbar" onSubmit={handleSubmit}>
        <div className="alerts-toolbar__controls">
          <label className="alerts-field">
            <span>Nombre del colegio</span>
            <input
              className="alerts-input"
              type="text"
              placeholder="Ej: IES Mi Colegio"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="username"
            />
          </label>
          <label className="alerts-field">
            <span>Ciudad</span>
            <input
              className="alerts-input"
              type="text"
              placeholder="Ej: Madrid"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </label>
        </div>
        <div className="alerts-toolbar__controls">
          <label className="alerts-field">
            <span>Contraseña</span>
            <input
              className="alerts-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </label>
          <label className="alerts-field">
            <span>Repetir contraseña</span>
            <input
              className="alerts-input"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </label>
        </div>
        <div className="alerts-toolbar__meta">
          <button type="submit" className="alerts-btn" disabled={submitting}>
            {submitting ? 'Registrando...' : 'Registrar Colegio'}
          </button>
        </div>
      </form>
    </main>
  );
}
function AddClassroomForm() {
  const { school } = useAuth();
  const [classroomName, setClassroomName] = useState('');
  const [classroomScore, setClassroomScore] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!classroomName.trim()) {
      setToast({ type: 'error', message: 'Escribe el nombre del aula.' });
      return;
    }
    setSubmitting(true);
    try {
      const payload = { name: classroomName.trim() };
      if (classroomScore !== '') {
        payload.score = Number(classroomScore);
      }
      const saved = await createClassroom(payload);
      setToast({ type: 'success', message: `Aula "${saved.name}" añadida correctamente.` });
      setClassroomName('');
      setClassroomScore('');
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'No se pudo añadir el aula.' });
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <main className="page-shell page-shell--narrow">
      <Toast type={toast?.type} message={toast?.message} onClose={() => setToast(null)} />
      <header className="page-header">
        <div>
          <h1 className="page-title">Añadir Aula</h1>
          <p className="page-subtitle">Conectado como {school?.name}.</p>
        </div>
        <Link to="/register" className="alerts-btn-secondary link-btn">
          Registrar Residuo
        </Link>
      </header>
      <form className="surface-card alerts-toolbar" onSubmit={handleSubmit}>
        <div className="alerts-toolbar__controls">
          <label className="alerts-field">
            <span>Nombre del aula</span>
            <input
              className="alerts-input"
              type="text"
              placeholder="Ej: 1oA"
              value={classroomName}
              onChange={(e) => setClassroomName(e.target.value)}
            />
          </label>
          <label className="alerts-field">
            <span>Puntuación inicial (opcional)</span>
            <input
              className="alerts-input"
              type="number"
              min="0"
              placeholder="0"
              value={classroomScore}
              onChange={(e) => setClassroomScore(e.target.value)}
            />
          </label>
        </div>
        <div className="alerts-toolbar__meta">
          <button type="submit" className="alerts-btn" disabled={submitting}>
            {submitting ? 'Añadiendo...' : 'Añadir Aula'}
          </button>
        </div>
      </form>
    </main>
  );
}
function RegisterSchool() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <AddClassroomForm /> : <RegisterSchoolForm />;
}
export default RegisterSchool;
