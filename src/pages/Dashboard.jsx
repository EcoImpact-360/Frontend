import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { dashboardApi } from '../api/dashboardApi';
import MetricCard from '../components/metrics/MetricCard';
import BarChartComponent from '../components/metrics/BarChartComponent';
import Toast from '../components/alerts/Toast';
function Dashboard() {
  const [data, setData] = useState(null);
  const [co2Ranking, setCo2Ranking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [metrics, ranking] = await Promise.all([
          dashboardApi.getMetrics(),
          dashboardApi.getCo2Ranking(),
        ]);
        setData(metrics);
        setCo2Ranking(Array.isArray(ranking) ? ranking : []);
      } catch (err) {
        setError(err.message || 'Error al cargar datos del servidor');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);
  if (loading) {
    return (
      <main className="page-shell">
        <div className="alerts-state">Cargando metricas reales...</div>
      </main>
    );
  }
  return (
    <main className="page-shell">
      <Toast type="error" message={error} onClose={() => setError(null)} />
      <header className="page-header">
        <div>
          <h1 className="page-title">EcoImpact 360 - Dashboard</h1>
          <p className="page-subtitle">Datos en tiempo real</p>
        </div>
        <div className="alerts-header-actions">
          <Link to="/register" className="alerts-btn link-btn">
            Registrar Residuo
          </Link>
          <Link to="/" className="alerts-btn-secondary link-btn">
            Volver al Inicio
          </Link>
        </div>
      </header>
      <section className="kpi-grid">
        <MetricCard title="Peso Recolectado" value={data?.totalKgRecolectados || 0} unit="kg" icon="KG" />
        <MetricCard title="Ahorro CO2" value={data?.totalCo2Equivalente?.toFixed(2) || 0} unit="kg" icon="CO2" />
        <MetricCard title="Agua Ahorrada" value={data?.totalAguaAhorrada || 0} unit="L" icon="H2O" />
        <MetricCard title="Arboles Salvados" value={data?.arbolesEquivalentes?.toFixed(2) || 0} icon="ARB" />
      </section>
      <section className="chart-grid">
        <BarChartComponent
          data={data?.rankingAulas || []}
          dataKey="score"
          xAxisKey="name"
          title="Puntuacion por Aula"
        />
        <BarChartComponent
          data={Object.entries(data?.residuosPorCategoria || {}).map(([key, val]) => ({ name: key, cantidad: val }))}
          dataKey="cantidad"
          title="Residuos por Categoria (kg)"
        />
        <BarChartComponent
          data={co2Ranking}
          dataKey="co2"
          xAxisKey="name"
          title="Ranking de Aulas por CO2 Evitado (kg)"
        />
      </section>
      <p className="dashboard-footnote">
        Equivalente a {data?.kmCarroEquivalente?.toFixed(1)} km recorridos en coche
      </p>
    </main>
  );
}
export default Dashboard;
