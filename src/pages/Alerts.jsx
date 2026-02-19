import React, { useEffect, useMemo, useRef, useState } from 'react';
import AlertCard from '../components/alerts/AlertCard';
import ResolveAlertModal from '../components/alerts/ResolveAlertModal';
import Toast from '../components/alerts/Toast';
import { getAlerts, resolveAlert } from '../services/alertsApi';

const SEVERITY_ORDER = {
  high: 3,
  medium: 2,
  low: 1,
};

const parseDate = (value) => {
  if (!value) return 0;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

export default function Alerts() {
  const [status, setStatus] = useState('loading');
  const [alerts, setAlerts] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [reloadToken, setReloadToken] = useState(0);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [isResolving, setIsResolving] = useState(false);
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const toastTimeoutRef = useRef(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = window.setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const handleCloseToast = () => {
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    setToast(null);
  };

  useEffect(() => {
    let isActive = true;
    setStatus('loading');
    setErrorMessage('');

    getAlerts()
      .then((data) => {
        if (!isActive) return;

        const payload = Array.isArray(data) ? data : [];
        setAlerts(payload);
        setStatus(payload.length ? 'success' : 'empty');
      })
      .catch((err) => {
        if (!isActive) return;
        setStatus('error');
        setErrorMessage(err?.message || 'Error al conectar con el servidor.');
      });

    return () => {
      isActive = false;
    };
  }, [reloadToken]);

  const handleOpenResolve = (alert) => {
    setSelectedAlert(alert);
  };

  const handleConfirmResolve = async () => {
    if (!selectedAlert) return;

    setIsResolving(true);
    try {
      await resolveAlert(selectedAlert.id);
      const data = await getAlerts();
      const payload = Array.isArray(data) ? data : [];

      setAlerts(payload);
      setStatus(payload.length ? 'success' : 'empty');
      showToast('success', 'Alerta resuelta correctamente.');
    } catch (err) {
      showToast('error', err?.message || 'No se pudo completar la accion.');
    } finally {
      setIsResolving(false);
      setSelectedAlert(null);
    }
  };

  const filteredAlerts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    let result = alerts.filter((alert) => {
      const searchable = [alert.title, alert.message, alert.category, alert.location, alert.assignedTo]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      if (query && !searchable.includes(query)) {
        return false;
      }

      if (severityFilter !== 'all' && alert.severity !== severityFilter) {
        return false;
      }

      if (statusFilter === 'pending' && alert.resolved) {
        return false;
      }

      if (statusFilter === 'resolved' && !alert.resolved) {
        return false;
      }

      return true;
    });

    result = [...result].sort((a, b) => {
      if (sortBy === 'oldest') {
        return parseDate(a.createdAt) - parseDate(b.createdAt);
      }

      if (sortBy === 'severity') {
        const severityDiff = (SEVERITY_ORDER[b.severity] || 0) - (SEVERITY_ORDER[a.severity] || 0);
        if (severityDiff !== 0) return severityDiff;
        return parseDate(b.createdAt) - parseDate(a.createdAt);
      }

      if (sortBy === 'pending-first') {
        if (a.resolved !== b.resolved) {
          return a.resolved ? 1 : -1;
        }
        return parseDate(b.createdAt) - parseDate(a.createdAt);
      }

      return parseDate(b.createdAt) - parseDate(a.createdAt);
    });

    return result;
  }, [alerts, searchTerm, severityFilter, statusFilter, sortBy]);

  const pendingCount = useMemo(() => alerts.filter((alert) => !alert.resolved).length, [alerts]);
  const resolvedCount = alerts.length - pendingCount;
  const hasActiveFilters =
    searchTerm.trim().length > 0 || severityFilter !== 'all' || statusFilter !== 'all' || sortBy !== 'recent';

  const handleResolveVisible = async () => {
    const pendingVisible = filteredAlerts.filter((alert) => !alert.resolved);

    if (!pendingVisible.length) {
      showToast('error', 'No hay alertas pendientes en la vista actual.');
      return;
    }

    setIsResolving(true);
    try {
      await Promise.all(pendingVisible.map((alert) => resolveAlert(alert.id)));
      const data = await getAlerts();
      const payload = Array.isArray(data) ? data : [];

      setAlerts(payload);
      setStatus(payload.length ? 'success' : 'empty');
      showToast('success', `${pendingVisible.length} alertas resueltas en bloque.`);
    } catch (err) {
      showToast('error', err?.message || 'No se pudo completar la accion masiva.');
    } finally {
      setIsResolving(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSeverityFilter('all');
    setStatusFilter('all');
    setSortBy('recent');
  };

  return (
    <main className="page-shell page-shell--narrow">
      <Toast type={toast?.type} message={toast?.message} onClose={handleCloseToast} />

      <header className="page-header">
        <div>
          <h1 className="page-title">Panel de Alertas</h1>
          <p className="page-subtitle">Gestiona eventos, prioridades y resolucion en tiempo real.</p>
        </div>
        <div className="alerts-header-actions">
          <button className="alerts-btn-secondary" onClick={handleResolveVisible} disabled={isResolving || status === 'loading'}>
            Resolver visibles
          </button>
          <button className="alerts-btn" onClick={() => setReloadToken((t) => t + 1)} disabled={status === 'loading'}>
            Actualizar
          </button>
        </div>
      </header>

      <section className="surface-card alerts-toolbar">
        <div className="alerts-toolbar__controls">
          <label className="alerts-field">
            <span>Buscar</span>
            <input
              className="alerts-input"
              type="search"
              placeholder="Titulo, mensaje, categoria, ubicacion..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>

          <label className="alerts-field">
            <span>Estado</span>
            <select className="alerts-select" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="all">Todos</option>
              <option value="pending">Pendientes</option>
              <option value="resolved">Resueltas</option>
            </select>
          </label>

          <label className="alerts-field">
            <span>Severidad</span>
            <select className="alerts-select" value={severityFilter} onChange={(event) => setSeverityFilter(event.target.value)}>
              <option value="all">Todas</option>
              <option value="high">Alta</option>
              <option value="medium">Media</option>
              <option value="low">Baja</option>
            </select>
          </label>

          <label className="alerts-field">
            <span>Orden</span>
            <select className="alerts-select" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="recent">Mas recientes</option>
              <option value="oldest">Mas antiguas</option>
              <option value="severity">Mayor severidad</option>
              <option value="pending-first">Pendientes primero</option>
            </select>
          </label>
        </div>

        <div className="alerts-toolbar__meta">
          <div className="alerts-chip">Total: {alerts.length}</div>
          <div className="alerts-chip alerts-chip--pending">Pendientes: {pendingCount}</div>
          <div className="alerts-chip alerts-chip--resolved">Resueltas: {resolvedCount}</div>
          <span className="alerts-result-count">Mostrando {filteredAlerts.length} resultado(s)</span>
          {hasActiveFilters && (
            <button type="button" className="alerts-btn-secondary" onClick={clearFilters}>
              Limpiar filtros
            </button>
          )}
        </div>
      </section>

      {status === 'loading' && <div className="alerts-state">Cargando alertas desde el servidor...</div>}

      {status === 'error' && (
        <div className="alerts-state alerts-state--error">
          <p>{errorMessage}</p>
          <button type="button" className="alerts-btn" onClick={() => setReloadToken((t) => t + 1)}>
            Reintentar conexion
          </button>
        </div>
      )}

      {status === 'empty' && (
        <div className="alerts-state alerts-state--empty">
          <p>No hay alertas pendientes de resoluci\u00f3n.</p>
        </div>
      )}

      {status === 'success' && filteredAlerts.length === 0 && (
        <div className="alerts-state alerts-state--empty">
          <p>No hay alertas que coincidan con los filtros actuales.</p>
          {hasActiveFilters && (
            <button type="button" className="alerts-btn-secondary" onClick={clearFilters}>
              Restablecer filtros
            </button>
          )}
        </div>
      )}

      {status === 'success' && filteredAlerts.length > 0 && (
        <section className="alerts-list">
          {filteredAlerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} disabled={isResolving} onResolve={handleOpenResolve} />
          ))}
        </section>
      )}

      <ResolveAlertModal
        open={Boolean(selectedAlert)}
        alert={selectedAlert}
        loading={isResolving}
        onClose={() => !isResolving && setSelectedAlert(null)}
        onConfirm={handleConfirmResolve}
      />
    </main>
  );
}
