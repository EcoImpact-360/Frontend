import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getClassrooms, getWasteTypes } from '../services/catalogApi';
import { createWasteEntry } from '../services/wasteEntriesApi';
import Toast from '../components/alerts/Toast';
function RegisterWaste() {
  const [classrooms, setClassrooms] = useState([]);
  const [wasteTypes, setWasteTypes] = useState([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [catalogError, setCatalogError] = useState(null);
  const [classroomId, setClassroomId] = useState('');
  const [wasteTypeId, setWasteTypeId] = useState('');
  const [quantityKg, setQuantityKg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [result, setResult] = useState(null);
  useEffect(() => {
    let isActive = true;
    Promise.all([getClassrooms(), getWasteTypes()])
      .then(([classroomsData, wasteTypesData]) => {
        if (!isActive) return;
        setClassrooms(Array.isArray(classroomsData) ? classroomsData : []);
        setWasteTypes(Array.isArray(wasteTypesData) ? wasteTypesData : []);
      })
      .catch((err) => {
        if (!isActive) return;
        setCatalogError(err.message || 'No se pudieron cargar aulas y tipos de residuo.');
      })
      .finally(() => {
        if (isActive) setLoadingCatalog(false);
      });
    return () => {
      isActive = false;
    };
  }, []);
  const handleSubmit = async (event) => {
    event.preventDefault();
    setResult(null);
    if (!classroomId || !wasteTypeId || !quantityKg) {
      setToast({ type: 'error', message: 'Completa aula, tipo de residuo y cantidad.' });
      return;
    }
    const quantity = Number(quantityKg);
    if (!Number.isFinite(quantity) || quantity <= 0) {
      setToast({ type: 'error', message: 'La cantidad debe ser un numero mayor que 0.' });
      return;
    }
    setSubmitting(true);
    try {
      const response = await createWasteEntry({
        classroomId: Number(classroomId),
        wasteTypeId: Number(wasteTypeId),
        quantityKg: quantity,
      });
      setResult(response);
      setToast({ type: 'success', message: 'Residuo registrado correctamente.' });
      setQuantityKg('');
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'No se pudo registrar el residuo.' });
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <main className="page-shell page-shell--narrow">
      <Toast type={toast?.type} message={toast?.message} onClose={() => setToast(null)} />
      <header className="page-header">
        <div>
          <h1 className="page-title">Registrar Residuo</h1>
          <p className="page-subtitle">Anota lo que ha recogido tu aula y mira el impacto al instante.</p>
        </div>
        <Link to="/dashboard" className="alerts-btn-secondary link-btn">
          Ver Dashboard
        </Link>
      </header>
      {loadingCatalog && <div className="alerts-state">Cargando aulas y tipos de residuo...</div>}
      {!loadingCatalog && catalogError && (
        <div className="alerts-state alerts-state--error">{catalogError}</div>
      )}
      {!loadingCatalog && !catalogError && (
        <form className="surface-card alerts-toolbar" onSubmit={handleSubmit}>
          <div className="alerts-toolbar__controls">
            <label className="alerts-field">
              <span>Aula</span>
              <select className="alerts-select" value={classroomId} onChange={(e) => setClassroomId(e.target.value)}>
                <option value="">Selecciona un aula</option>
                {classrooms.map((classroom) => (
                  <option key={classroom.id} value={classroom.id}>
                    {classroom.name}
                  </option>
                ))}
              </select>
              {classrooms.length === 0 && (
                <small>
                  No hay aulas todavia. <Link to="/register-school">Registra tu colegio y aula aqui</Link>.
                </small>
              )}
            </label>
            <label className="alerts-field">
              <span>Tipo de residuo</span>
              <select className="alerts-select" value={wasteTypeId} onChange={(e) => setWasteTypeId(e.target.value)}>
                <option value="">Selecciona un tipo</option>
                {wasteTypes.map((wasteType) => (
                  <option key={wasteType.id} value={wasteType.id}>
                    {wasteType.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="alerts-field">
              <span>Cantidad (kg)</span>
              <input
                className="alerts-input"
                type="number"
                min="0.1"
                step="0.1"
                placeholder="Ej: 2.5"
                value={quantityKg}
                onChange={(e) => setQuantityKg(e.target.value)}
              />
            </label>
          </div>
          <div className="alerts-toolbar__meta">
            <button type="submit" className="alerts-btn" disabled={submitting}>
              {submitting ? 'Registrando...' : 'Registrar'}
            </button>
          </div>
        </form>
      )}
      {result && (
        <section className="surface-card home-hero">
          <h2 className="chart-card__title">Impacto de este registro</h2>
          <div className="kpi-grid">
            <div className="metric-card">
              <p className="metric-card__label">CO2 evitado</p>
              <h3 className="metric-card__value">{result.co2Kg?.toFixed(2) ?? 0} kg</h3>
            </div>
            <div className="metric-card">
              <p className="metric-card__label">Agua ahorrada</p>
              <h3 className="metric-card__value">{result.waterSaved?.toFixed(2) ?? 0} L</h3>
            </div>
            <div className="metric-card">
              <p className="metric-card__label">Arboles equivalentes</p>
              <h3 className="metric-card__value">{result.treesEquivalent?.toFixed(3) ?? 0}</h3>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
export default RegisterWaste;
