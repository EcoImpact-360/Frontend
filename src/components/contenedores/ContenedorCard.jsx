import React from 'react';

/**
 * ContenedorCard - TK-001-02
 * Tarjeta visual reutilizable para contenedor
 * Muestra: ubicación, % llenado, barra progreso, kg
 * La barra de progreso usa colores: verde <60%, amarillo 60-80%, rojo >80%
 */
function ContenedorCard({ contenedor, onEdit, onDelete }) {
  // Calcular porcentaje de llenado
  const capacidadMax = contenedor.capacidad_max || 0;
  const nivelActual = contenedor.nivel_actual || 0;
  const porcentajeLlenado = capacidadMax > 0 
    ? Math.round((nivelActual / capacidadMax) * 100) 
    : 0;

  // Determinar color según nivel de llenado (TK-001-12)
  const getNivelColor = (porcentaje) => {
    if (porcentaje < 60) return 'var(--brand-primary)';
    if (porcentaje <= 80) return 'var(--warning-soft)';
    return 'var(--alert-critical)';
  };

  const nivelColor = getNivelColor(porcentajeLlenado);

  // Calcular kg restantes
  const kgRestantes = capacidadMax - nivelActual;

  return (
    <article className="contenedor-card">
      <header className="contenedor-card-header">
        <div>
          <h3 className="contenedor-card-title">
            {contenedor.name || `Contenedor ${contenedor.id}`}
          </h3>
          <span className="contenedor-card-location">
            📍 {contenedor.ubicacion || 'Sin ubicación'}
          </span>
        </div>
        
        {/* Indicador de porcentaje */}
        <div
          className="contenedor-percentage-badge"
          style={{ background: nivelColor }}
        >
          {porcentajeLlenado}%
        </div>
      </header>

      {/* Barra de progreso visual (TK-001-12) */}
      <div className="contenedor-progress-section">
        <div className="contenedor-progress-header">
          <span className="contenedor-progress-label">Nivel de llenado</span>
          <span className="contenedor-progress-value" style={{ color: nivelColor }}>
            {porcentajeLlenado}%
          </span>
        </div>
        
        <div className="contenedor-progress-bar">
          <div
            className="contenedor-progress-fill"
            style={{ width: `${porcentajeLlenado}%`, background: nivelColor }}
          />
        </div>
        
        {/* Leyenda de colores */}
        <div className="contenedor-progress-legend">
          <span>🟢 Bajo ({'<'}60%)</span>
          <span>🟡 Medio (60-80%)</span>
          <span>🔴 Alto ({'>'}80%)</span>
        </div>
      </div>

      {/* Información de capacidad */}
      <div className="contenedor-capacity-grid">
        <div className="contenedor-capacity-item">
          <div className="contenedor-capacity-label">Actual</div>
          <div className="contenedor-capacity-value">{nivelActual}</div>
          <div className="contenedor-capacity-unit">kg</div>
        </div>
        
        <div className="contenedor-capacity-item">
          <div className="contenedor-capacity-label">Capacidad</div>
          <div className="contenedor-capacity-value">{capacidadMax}</div>
          <div className="contenedor-capacity-unit">kg máx</div>
        </div>
        
        <div className="contenedor-capacity-item contenedor-capacity-restante">
          <div className="contenedor-capacity-label">Restante</div>
          <div className="contenedor-capacity-value">{kgRestantes}</div>
          <div className="contenedor-capacity-unit">kg</div>
        </div>
      </div>

      {/* Última vacuada */}
      {contenedor.ultima_vaciada && (
        <div className="contenedor-last-vaciada">
          📅 Última vacuada: {contenedor.ultima_vaciada}
        </div>
      )}

      {/* Botones de acción */}
      <div className="contenedor-card-actions">
        <button
          onClick={() => onEdit && onEdit(contenedor)}
          className="btn btn-edit"
        >
          ✏️ Editar
        </button>
        
        <button
          onClick={() => onDelete && onDelete(contenedor.id)}
          className="btn btn-delete"
        >
          🗑️ Eliminar
        </button>
      </div>
    </article>
  );
}

export default ContenedorCard;
