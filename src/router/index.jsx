import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import Alerts from '../pages/Alerts';

// Renders a fallback page for unknown routes.
function NotFound() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>404 - Página no encontrada</h1>
      <a href="/">Volver al inicio</a>
    </div>
  );
}

// Declares the application's route map.
function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/alerts" element={<Alerts />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default Router;
