import { Link } from 'react-router-dom';

function Home() {
  return (
    <main className="page-shell page-shell--narrow">
      <section className="surface-card home-hero">
        <h1 className="page-title">¡Hola, guardianes del planeta!</h1>
        <p>Bienvenid@s a EcoImpact 360. El lugar donde aprenderemos a cuidar nuestro mundo</p>
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
