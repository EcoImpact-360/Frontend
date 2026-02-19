import React from 'react';

/**
 * AulaCard - TK-001-01
 * Tarjeta visual reutilizable para mostrar datos de un aula
 * Muestra: nombre, % reciclado, y kg recolectados por categoría
 */
function AulaCard({ aula, onEdit, onDelete }) {
  // Calcular totales de basura y reciclables
  const totalBasura = aula.cubos_por_dia?.reduce(
    (sum, dia) => sum + (dia.cubos_basura || 0), 0
  ) || 0;
  
  const totalReciclables = aula.cubos_por_dia?.reduce(
    (sum, dia) => sum + (dia.cubos_reciclables || 0), 0
  ) || 0;
  
  const totalGeneral = totalBasura + totalReciclables;
  const porcentajeReciclado = totalGeneral > 0 
    ? Math.round((totalReciclables / totalGeneral) * 100) 
    : 0;

  // Determinar color del porcentaje
  const getPorcentajeColor = (porcentaje) => {
    if (porcentaje >= 60) return 'var(--brand-primary)';
    if (porcentaje >= 40) return 'var(--warning-soft)';
    return 'var(--alert-critical)';
  };

  return (
    <article className="aula-card">
      <header className="aula-card-header">
        <div>
          <h3 className="aula-card-title">
            {aula.name || `Aula ${aula.id}`}
          </h3>
          <span className="aula-card-id">
            ID: {aula.id}
          </span>
        </div>
        
        {/* Indicador de porcentaje reciclado */}
        <div
          className="aula-percentage-badge"
          style={{ background: getPorcentajeColor(porcentajeReciclado) }}
        >
          {porcentajeReciclado}% ♻️
        </div>
      </header>

      {/* Información de kg por categoría */}
      <div className="aula-category-section">
        <h4 className="aula-category-title">
          Kilogramos por Categoría
        </h4>
        
        <div className="aula-category-grid">
          <div className="aula-category-item aula-category-basura">
            <div className="aula-category-label">Basura</div>
            <div className="aula-category-value">
              {totalBasura} kg
            </div>
          </div>
          
          <div className="aula-category-item aula-category-reciclables">
            <div className="aula-category-label">Reciclables</div>
            <div className="aula-category-value">
              {totalReciclables} kg
            </div>
          </div>
        </div>
      </div>

      {/* Total semanal */}
      <div className="aula-total-weekly">
        <span className="aula-total-text">
          Total Semana: {aula.total_cubos_semana || totalGeneral} unidades
        </span>
      </div>

      {/* Botones de acción */}
      <div className="aula-card-actions">
        <button
          onClick={() => onEdit && onEdit(aula)}
          className="btn btn-edit"
        >
          ✏️ Editar
        </button>
        
        <button
          onClick={() => onDelete && onDelete(aula.id)}
          className="btn btn-delete"
        >
          🗑️ Eliminar
        </button>
      </div>
    </article>
  );
}

export default AulaCard;
