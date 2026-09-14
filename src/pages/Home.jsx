import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
function Home() {
  const { isAuthenticated, school } = useAuth();
  return (
    <main className="page-shell page-shell--narrow">
      <section className="surface-card home-hero">
        <h1 className="page-title">¡Hola, guardianes del planeta!</h1>
        {isAuthenticated ? (
          <p>Bienvenido de nuevo, {school?.name}. Sigue registrando el impacto de tu colegio.</p>
        ) : (
          <p>Bienvenid@s a EcoImpact 360. El lugar donde aprenderemos a cuidar nuestro mundo</p>
        )}
        <div className="home-hero__actions">
          {isAuthenticated ? (
            <>
              <Link to="/register" className="alerts-btn link-btn">
                Registrar Residuo
              </Link>
              <Link to="/dashboard" className="alerts-btn-secondary link-btn">
                Ir al Dashboard
              </Link>
              <Link to="/alerts" className="alerts-btn-secondary link-btn">
                Ir a las Alertas
              </Link>
              <Link to="/register-school" className="alerts-btn-secondary link-btn">
                Añadir Aula
              </Link>
            </>
          ) : (
            <>
              <Link to="/register-school" className="alerts-btn link-btn">
                Registrar Colegio
              </Link>
              <Link to="/login" className="alerts-btn-secondary link-btn">
                Iniciar sesión
              </Link>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
export default Home;
