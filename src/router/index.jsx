import { Routes, Route, Link } from 'react-router-dom';
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import AlertsPage from '../pages/Alerts';
import RegisterWaste from '../pages/RegisterWaste';
import RegisterSchool from '../pages/RegisterSchool';
import Login from '../pages/Login';
import RequireAuth from '../components/routing/RequireAuth';
function NotFound() {
  return (
    <main className="page-shell page-shell--narrow">
      <div className="surface-card not-found">
        <h1 className="page-title">404 - Pagina no encontrada</h1>
        <p>Lo sentimos, la ruta que buscas no existe.</p>
        <Link to="/">Volver al inicio</Link>
      </div>
    </main>
  );
}
function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register-school" element={<RegisterSchool />} />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/alerts"
        element={
          <RequireAuth>
            <AlertsPage />
          </RequireAuth>
        }
      />
      <Route
        path="/register"
        element={
          <RequireAuth>
            <RegisterWaste />
          </RequireAuth>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
export default Router;
