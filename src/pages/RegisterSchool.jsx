import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getSchools, createSchool } from '../services/schoolsApi';
import { createClassroom } from '../services/catalogApi';
import Toast from '../components/alerts/Toast';
function RegisterSchool() {
  const [schools, setSchools] = useState([]);
  const [loadingSchools, setLoadingSchools] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [schoolName, setSchoolName] = useState('');
  const [schoolCity, setSchoolCity] = useState('');
  const [creatingSchool, setCreatingSchool] = useState(false);
  const [selectedSchoolId, setSelectedSchoolId] = useState('');
  const [classroomName, setClassroomName] = useState('');
  const [classroomScore, setClassroomScore] = useState('');
  const [creatingClassroom, setCreatingClassroom] = useState(false);
  const [toast, setToast] = useState(null);
  const loadSchools = () => {
    setLoadingSchools(true);
    getSchools()
      .then((data) => {
        setSchools(Array.isArray(data) ? data : []);
        setLoadError(null);
      })
      .catch((err) => {
        setLoadError(err.message || 'No se pudieron cargar los colegios.');
      })
      .finally(() => setLoadingSchools(false));
  };
  useEffect(() => {
    loadSchools();
  }, []);
  const handleCreateSchool = async (event) => {
    event.preventDefault();
    if (!schoolName.trim()) {
      setToast({ type: 'error', message: 'El nombre del colegio es obligatorio.' });
      return;
    }
    setCreatingSchool(true);
    try {
      const saved = await createSchool({ name: schoolName.trim(), city: schoolCity.trim() || null });
      setToast({ type: 'success', message: `Colegio "${saved.name}" registrado correctamente.` });
      setSchoolName('');
      setSchoolCity('');
      setSelectedSchoolId(String(saved.id));
      loadSchools();
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'No se pudo registrar el colegio.' });
    } finally {
      setCreatingSchool(false);
    }
  };
  const handleCreateClassroom = async (event) => {
    event.preventDefault();
    if (!selectedSchoolId || !classroomName.trim()) {
      setToast({ type: 'error', message: 'Selecciona un colegio y escribe el nombre del aula.' });
      return;
    }
    setCreatingClassroom(true);
    try {
      const payload = { name: classroomName.trim(), schoolId: Number(selectedSchoolId) };
      if (classroomScore !== '') {
        payload.score = Number(classroomScore);
      }
      const saved = await createClassroom(payload);
      setToast({ type: 'success', message: `Aula "${saved.name}" anadida correctamente.` });
      setClassroomName('');
      setClassroomScore('');
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'No se pudo anadir el aula.' });
    } finally {
      setCreatingClassroom(false);
    }
  };
  return (
    <main className="page-shell page-shell--narrow">
      <Toast type={toast?.type} message={toast?.message} onClose={() => setToast(null)} />
      <header className="page-header">
        <div>
          <h1 className="page-title">Registrar Colegio</h1>
          <p className="page-subtitle">Da de alta tu colegio y sus aulas para empezar a registrar residuos.</p>
        </div>
        <Link to="/register" className="alerts-btn-secondary link-btn">
          Registrar Residuo
        </Link>
      </header>
      <form className="surface-card alerts-toolbar" onSubmit={handleCreateSchool}>
        <h2 className="chart-card__title">Nuevo colegio</h2>
        <div className="alerts-toolbar__controls">
          <label className="alerts-field">
            <span>Nombre del colegio</span>
            <input
              className="alerts-input"
              type="text"
              placeholder="Ej: IES Mi Colegio"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
            />
          </label>
          <label className="alerts-field">
            <span>Ciudad</span>
            <input
              className="alerts-input"
              type="text"
              placeholder="Ej: Madrid"
              value={schoolCity}
              onChange={(e) => setSchoolCity(e.target.value)}
            />
          </label>
        </div>
        <div className="alerts-toolbar__meta">
          <button type="submit" className="alerts-btn" disabled={creatingSchool}>
            {creatingSchool ? 'Registrando...' : 'Registrar Colegio'}
          </button>
        </div>
      </form>
      <form className="surface-card alerts-toolbar" onSubmit={handleCreateClassroom}>
        <h2 className="chart-card__title">Anadir aula a un colegio</h2>
        {loadingSchools && <p>Cargando colegios...</p>}
        {!loadingSchools && loadError && <p className="alerts-state alerts-state--error">{loadError}</p>}
        {!loadingSchools && !loadError && (
          <>
            <div className="alerts-toolbar__controls">
              <label className="alerts-field">
                <span>Colegio</span>
                <select
                  className="alerts-select"
                  value={selectedSchoolId}
                  onChange={(e) => setSelectedSchoolId(e.target.value)}
                >
                  <option value="">Selecciona un colegio</option>
                  {schools.map((school) => (
                    <option key={school.id} value={school.id}>
                      {school.name}
                    </option>
                  ))}
                </select>
              </label>
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
                <span>Puntuacion inicial (opcional)</span>
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
              <button type="submit" className="alerts-btn" disabled={creatingClassroom || schools.length === 0}>
                {creatingClassroom ? 'Anadiendo...' : 'Anadir Aula'}
              </button>
              {schools.length === 0 && <span className="alerts-result-count">Registra un colegio primero.</span>}
            </div>
          </>
        )}
      </form>
    </main>
  );
}
export default RegisterSchool;
