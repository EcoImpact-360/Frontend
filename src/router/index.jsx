import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import AlertsPage from '../pages/Alerts'; // Importa la nueva página de alertas

// Renders a fallback page for unknown routes.
function NotFound() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>404 - Página no encontrada</h1>
      <p>Lo sentimos, la ruta que buscas no existe.</p>
      <a href="/" style={{ color: '#3b82f6', textDecoration: 'underline' }}>Volver al inicio</a>
    </div>
  );
}

// Declares the application's route map.
function Router() {
  return (
    <Routes>
      {/* Ruta principal: Landing page o Home */}
      <Route path="/" element={<Home />} />

      {/* Panel de control con métricas reales */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Gestión de Alertas conectada al backend */}
      <Route path="/alerts" element={<AlertsPage />} />

      {/* Fallback para rutas no existentes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default Router;