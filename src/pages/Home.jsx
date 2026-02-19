import { Link } from 'react-router-dom';

// Displays the landing page and provides navigation to the dashboard.
function Home() {
  return (
    <main className="page-shell page-shell--narrow">
      <section className="surface-card home-hero">
        <h1 className="page-title">Bienvenido a la Aplicacion</h1>
        <p>Esta es la pagina de inicio.</p>
        <Link to="/dashboard" className="alerts-btn link-btn mr-2">
          Ir al Dashboard
        </Link>
        <Link to="/alerts" className="alerts-btn link-btn">
          Ir a las Alertas
        </Link>
      </section>
    </main>
  );
}

export default Home;
