import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import MetricCard from '../components/metrics/MetricCard';
import BarChartComponent from '../components/metrics/BarChartComponent';

// Renders dashboard metrics and charts using live data from the fake API.
function Dashboard() {
  const { data: metrics, loading: loadingMetrics, error: errorMetrics } = useFetch('/aulas', {
    dependencies: []
  });

  const { data: contenedores, loading: loadingContenedores } = useFetch('/contenedores');

  // Aggregates aulas and contenedores into top-level KPI values for cards.
  const calculateMetrics = () => {
    if (!metrics) return null;
    
    const totalCubos = metrics.reduce((sum, aula) => sum + (aula.total_cubos_semana || 0), 0);
    const totalReciclables = metrics.reduce((sum, aula) => {
      return sum + aula.cubos_por_dia.reduce((s, d) => s + (d.cubos_reciclables || 0), 0);
    }, 0);
    const totalBasura = metrics.reduce((sum, aula) => {
      return sum + aula.cubos_por_dia.reduce((s, d) => s + (d.cubos_basura || 0), 0);
    }, 0);
    
    let capacidadTotal = 0;
    let nivelActual = 0;
    if (contenedores) {
      capacidadTotal = contenedores.reduce((sum, c) => sum + (c.capacidad_max || 0), 0);
      nivelActual = contenedores.reduce((sum, c) => sum + (c.nivel_actual || 0), 0);
    }
    
    return {
      totalCubos,
      totalReciclables,
      totalBasura,
      totalAulas: metrics.length,
      nivelPromedio: capacidadTotal > 0 ? Math.round((nivelActual / capacidadTotal) * 100) : 0,
    };
  };

  const displayMetrics = calculateMetrics() || {
    totalCubos: 0,
    totalReciclables: 0,
    totalBasura: 0,
    totalAulas: 0,
    nivelPromedio: 0,
  };

  // Converts aulas data into chart series for basura vs reciclables.
  const chartData = metrics ? metrics.map(aula => ({
    name: aula.name,
    basura: aula.cubos_por_dia.reduce((s, d) => s + (d.cubos_basura || 0), 0),
    reciclables: aula.cubos_por_dia.reduce((s, d) => s + (d.cubos_reciclables || 0), 0),
  })) : [];

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Dashboard - Gestión de Residuos</h1>
        <Link to="/">Volver al Inicio</Link>
      </div>

      {errorMetrics && (
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#fee2e2', 
          color: '#dc2626', 
          borderRadius: '8px',
          marginBottom: '1rem'
        }}>
          Error: {errorMetrics}
        </div>
      )}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <MetricCard 
          title="Total Cubos Semana" 
          value={displayMetrics.totalCubos} 
          type="number" 
          icon="🗑️"
        />
        <MetricCard 
          title="Total Reciclables" 
          value={displayMetrics.totalReciclables} 
          type="number" 
          icon="♻️"
        />
        <MetricCard 
          title="Total Basura" 
          value={displayMetrics.totalBasura} 
          type="number" 
          icon="🗑️"
        />
        <MetricCard 
          title="Nivel Promedio Contenedores" 
          value={displayMetrics.nivelPromedio} 
          type="percentage" 
          icon="📊"
        />
      </div>

      {loadingMetrics && <p>Cargando métricas...</p>}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: '1rem' 
      }}>
        <BarChartComponent 
          data={chartData} 
          dataKey="basura" 
          title="Basura por Aula" 
        />
        <BarChartComponent 
          data={chartData} 
          dataKey="reciclables" 
          title="Reciclables por Aula" 
        />
      </div>

      {(loadingMetrics || loadingContenedores) && (
        <p style={{ marginTop: '1rem' }}>Cargando gráficos...</p>
      )}
    </div>
  );
}

export default Dashboard;
