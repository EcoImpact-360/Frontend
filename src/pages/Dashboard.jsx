import { useState } from 'react';
import { Link } from 'react-router-dom';
import useAulas from '../hooks/useAulas';
import useContenedores from '../hooks/useContenedores';
import MetricCard from '../components/metrics/MetricCard';
import BarChartComponent from '../components/metrics/BarChartComponent';
import AulaList from '../components/aulas/AulaList';
import ContenedorList from '../components/contenedores/ContenedorList';
import ModalAula from '../components/aulas/ModalAula';
import ModalContenedor from '../components/contenedores/ModalContenedor';

/**
 * Dashboard - TK-001-10
 * Panel Administrativo que muestra el catálogo de aulas y contenedores
 * Con integración de fetch inicial y renderizado dinámico
 */
function Dashboard() {
  // Modal states
  const [showModalAula, setShowModalAula] = useState(false);
  const [showModalContenedor, setShowModalContenedor] = useState(false);
  const [editingAula, setEditingAula] = useState(null);
  const [editingContenedor, setEditingContenedor] = useState(null);
  const [notification, setNotification] = useState(null);

  // Custom hooks for CRUD operations
  const { 
    aulas, 
    loading: loadingAulas, 
    error: errorAulas,
    createAula,
    updateAula,
    deleteAula
  } = useAulas();

  const { 
    contenedores, 
    loading: loadingContenedores,
    error: errorContenedores,
    createContenedor,
    updateContenedor,
    deleteContenedor
  } = useContenedores();

  // Show notification helper
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Handlers for Aula CRUD
  const handleAddAula = () => {
    setEditingAula(null);
    setShowModalAula(true);
  };

  const handleEditAula = (aula) => {
    setEditingAula(aula);
    setShowModalAula(true);
  };

  const handleDeleteAula = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta aula?')) {
      const result = await deleteAula(id);
      if (result.success) {
        showNotification('success', 'Aula eliminada correctamente');
      } else {
        showNotification('error', result.error || 'Error al eliminar aula');
      }
    }
  };

  const handleSaveAula = async (aulaData) => {
    let result;
    if (editingAula) {
      result = await updateAula(editingAula.id, aulaData);
      if (result.success) {
        showNotification('success', 'Aula actualizada correctamente');
      }
    } else {
      result = await createAula(aulaData);
      if (result.success) {
        showNotification('success', 'Aula creada correctamente');
      }
    }
    
    if (!result.success) {
      showNotification('error', result.error || 'Error al guardar aula');
    }
    
    // TK-001-11: Los datos se refrescan automáticamente en el hook
    return result;
  };

  // Handlers for Contenedor CRUD
  const handleAddContenedor = () => {
    setEditingContenedor(null);
    setShowModalContenedor(true);
  };

  const handleEditContenedor = (contenedor) => {
    setEditingContenedor(contenedor);
    setShowModalContenedor(true);
  };

  const handleDeleteContenedor = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este contenedor?')) {
      const result = await deleteContenedor(id);
      if (result.success) {
        showNotification('success', 'Contenedor eliminado correctamente');
      } else {
        showNotification('error', result.error || 'Error al eliminar contenedor');
      }
    }
  };

  const handleSaveContenedor = async (contenedorData) => {
    let result;
    if (editingContenedor) {
      result = await updateContenedor(editingContenedor.id, contenedorData);
      if (result.success) {
        showNotification('success', 'Contenedor actualizado correctamente');
      }
    } else {
      result = await createContenedor(contenedorData);
      if (result.success) {
        showNotification('success', 'Contenedor creado correctamente');
      }
    }
    
    if (!result.success) {
      showNotification('error', result.error || 'Error al guardar contenedor');
    }
    
    // TK-001-11: Los datos se refrescan automáticamente en el hook
    return result;
  };

  // Calculate metrics from data
  const calculateMetrics = () => {
    const totalCubos = aulas?.reduce((sum, aula) => sum + (aula.total_cubos_semana || 0), 0) || 0;
    const totalReciclables = aulas?.reduce((sum, aula) => {
      return sum + aula.cubos_por_dia?.reduce((s, d) => s + (d.cubos_reciclables || 0), 0) || 0;
    }, 0) || 0;
    const totalBasura = aulas?.reduce((sum, aula) => {
      return sum + aula.cubos_por_dia?.reduce((s, d) => s + (d.cubos_basura || 0), 0) || 0;
    }, 0) || 0;
    
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
      totalAulas: aulas?.length || 0,
      nivelPromedio: capacidadTotal > 0 ? Math.round((nivelActual / capacidadTotal) * 100) : 0,
    };
  };

  const displayMetrics = calculateMetrics();

  // Chart data
  const chartData = aulas?.map(aula => ({
    name: aula.name,
    basura: aula.cubos_por_dia?.reduce((s, d) => s + (d.cubos_basura || 0), 0) || 0,
    reciclables: aula.cubos_por_dia?.reduce((s, d) => s + (d.cubos_reciclables || 0), 0) || 0,
  })) || [];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1>📊 Dashboard - Gestión de Residuos</h1>
        <Link to="/" className="btn-back">
          ← Volver al Inicio
        </Link>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`notification notification-${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Error display */}
      {(errorAulas || errorContenedores) && (
        <div className="error-message">
          Error: {errorAulas || errorContenedores}
        </div>
      )}

      {/* Metric Cards - Totales por categoría (Criterio Escenario 1) */}
      <div className="metrics-grid">
        <MetricCard 
          title="Total Aulas" 
          value={displayMetrics.totalAulas} 
          type="number" 
          icon=""
        />
        <MetricCard 
          title="Total Cubos Semana" 
          value={displayMetrics.totalCubos} 
          type="number" 
          icon=""
        />
        <MetricCard 
          title="Total Reciclables" 
          value={displayMetrics.totalReciclables} 
          type="number" 
          icon=""
        />
        <MetricCard 
          title="Total Basura" 
          value={displayMetrics.totalBasura} 
          type="number" 
          icon=""
        />
        <MetricCard 
          title="Nivel Promedio Contenedores" 
          value={displayMetrics.nivelPromedio} 
          type="percentage" 
          icon=""
        />
      </div>

      {/* Charts - Gráfica semanal (Criterio Escenario 1) */}
      {loadingAulas ? (
        <p className="loading-text">Cargando métricas...</p>
      ) : (
        <div className="charts-grid">
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
      )}

      {/* Lista de Aulas (Escenario 1 y 2) */}
      <div className="section-container">
        {loadingAulas ? (
          <p className="loading-text">Cargando aulas...</p>
        ) : (
          <AulaList 
            aulas={aulas}
            onEdit={handleEditAula}
            onDelete={handleDeleteAula}
            onAdd={handleAddAula}
          />
        )}
      </div>

      {/* Lista de Contenedores (Escenario 1 y 3) */}
      <div className="section-container">
        {loadingContenedores ? (
          <p className="loading-text">Cargando contenedores...</p>
        ) : (
          <ContenedorList 
            contenedores={contenedores}
            onEdit={handleEditContenedor}
            onDelete={handleDeleteContenedor}
            onAdd={handleAddContenedor}
          />
        )}
      </div>

      {/* Modals */}
      <ModalAula 
        isOpen={showModalAula}
        onClose={() => {
          setShowModalAula(false);
          setEditingAula(null);
        }}
        onSave={handleSaveAula}
        aula={editingAula}
      />

      <ModalContenedor 
        isOpen={showModalContenedor}
        onClose={() => {
          setShowModalContenedor(false);
          setEditingContenedor(null);
        }}
        onSave={handleSaveContenedor}
        contenedor={editingContenedor}
      />
    </div>
  );
}

export default Dashboard;
