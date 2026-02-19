import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { dashboardApi } from '../api/dashboardApi';
import MetricCard from '../components/metrics/MetricCard';
import BarChartComponent from '../components/metrics/BarChartComponent';
import Toast from '../components/alerts/Toast';

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Llamada a tu endpoint /api/v1/dashboard/global
        const result = await dashboardApi.getMetrics();
        setData(result);
      } catch (err) {
        setError(err.message || "Error al cargar datos del servidor");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Si no hay datos todavía, mostramos un estado de carga
  if (loading) return <div style={{ padding: '2rem' }}>Cargando métricas reales...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <Toast type="error" message={error} onClose={() => setError(null)} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>EcoImpact 360 - Dashboard</h1>
          <p style={{ color: '#6b7280' }}>Datos reales desde el backend</p>
        </div>
        <Link to="/" className="alerts-btn">Volver al Inicio</Link>
      </div>

      {/* Grid de KPIs - Usando los campos exactos del JSON de tu curl */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <MetricCard 
          title="Peso Recolectado" 
          value={data?.totalKgRecolectados || 0} 
          unit="kg"
          icon="⚖️"
        />
        <MetricCard 
          title="Ahorro CO2" 
          value={data?.totalCo2Equivalente?.toFixed(2) || 0} 
          unit="kg" 
          icon="🍃"
        />
        <MetricCard 
          title="Agua Ahorrada" 
          value={data?.totalAguaAhorrada || 0} 
          unit="L" 
          icon="💧"
        />
        <MetricCard 
          title="Árboles Salva." 
          value={data?.arbolesEquivalentes?.toFixed(2) || 0} 
          icon="🌳"
        />
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', 
        gap: '1.5rem' 
      }}>
        {/* Ranking de Aulas - El backend devuelve 'rankingAulas' con [{name, score}] */}
        <BarChartComponent 
          data={data?.rankingAulas || []} 
          dataKey="score" 
          xAxisKey="name"
          title="Puntuación por Aula" 
        />

        {/* Distribución por Categoría - El backend devuelve 'residuosPorCategoria' */}
        <BarChartComponent 
          data={Object.entries(data?.residuosPorCategoria || {}).map(([key, val]) => ({ name: key, cantidad: val }))} 
          dataKey="cantidad" 
          title="Residuos por Categoría (kg)" 
        />
      </div>
      
      <div style={{ marginTop: '2rem', textAlign: 'center', color: '#9ca3af', fontSize: '0.875rem' }}>
        Equivalente a {data?.kmCarroEquivalente?.toFixed(1)} km recorridos en coche 🚗
      </div>
    </div>
  );
}

export default Dashboard;