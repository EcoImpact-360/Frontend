import { Link } from 'react-router-dom';

// Displays the landing page and provides navigation to the dashboard.
function Home() {
  return (
    <div className="home-container">
      <h1>Bienvenido a la Aplicación</h1>
      <p>Esta es la página de inicio.</p>
      <div className="home-buttons">
        <Link to="/dashboard" className="btn btn-primary">
          Ir al Dashboard
        </Link>
        <Link to="/alerts" className="btn btn-primary">
          Ir a los Alerts
        </Link>
      </div>
    </div>
  );
}

export default Home;
