import { Link } from 'react-router-dom';

// Displays the landing page and provides navigation to the dashboard.
function Home() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Bienvenido a la Aplicación</h1>
      <p>Esta es la página de inicio.</p>
      <Link to="/dashboard">Ir al Dashboard</Link>
      <Link to="/alerts">Ir a los Alertas</Link>
    </div>
  );
}

export default Home;
