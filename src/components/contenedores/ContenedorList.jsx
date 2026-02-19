import React, { useState } from 'react';
import ContenedorCard from './ContenedorCard';

/**
 * ContenedorList - TK-001-04
 * Componente colapsable/expandible que muestra todos los contenedores
 * Los contenedores están ordenados por ubicación o ID
 */
function ContenedorList({ contenedores, onEdit, onDelete, onAdd }) {
  const [expanded, setExpanded] = useState(false);

  // Ordenar contenedores por ubicación o ID (Criterio de Aceptación Escenario 1)
  const contenedoresOrdenados = [...(contenedores || [])].sort((a, b) => {
    // Primero por ubicación, luego por ID
    const ubicacionA = (a.ubicacion || '').toLowerCase();
    const ubicacionB = (b.ubicacion || '').toLowerCase();
    if (ubicacionA !== ubicacionB) {
      return ubicacionA.localeCompare(ubicacionB);
    }
    return (a.id || 0) - (b.id || 0);
  });

  if (!contenedores || contenedores.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '3rem',
          background: '#F9FAFB',
          borderRadius: '12px',
          border: '2px dashed #E5E7EB',
          marginTop: '1.5rem',
        }}
      >
        <p style={{ color: '#6B7280', fontSize: '1rem', marginBottom: '1rem' }}>
          🗑️ No hay contenedores registrados
        </p>
        <button
          onClick={onAdd}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#10B981',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer',
          }}
        >
          + Agregar Primer Contenedor
        </button>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      {/* Encabezado colapsable (Criterio de Aceptación Escenario 1) */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 1.5rem',
          background: '#EEF2FF',
          borderRadius: '12px',
          cursor: 'pointer',
          border: '1px solid #C7D2FE',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🗑️</span>
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#111827',
              margin: 0,
            }}
          >
            Contenedores ({contenedoresOrdenados.length})
          </h2>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Botón agregar dentro del collapsible */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdd();
            }}
            style={{
              padding: '0.5rem 1rem',
              background: '#10B981',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            + Agregar
          </button>
          
          {/* Indicador de expand/collapse */}
          <span
            style={{
              fontSize: '1.25rem',
              color: '#4F46E5',
              transition: 'transform 0.3s',
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            ▼
          </span>
        </div>
      </div>

      {/* Contenido expandible */}
      <div
        style={{
          maxHeight: expanded ? '2000px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.5s ease-in-out',
        }}
      >
        <div
          style={{
            padding: '1.5rem 0',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {contenedoresOrdenados.map((contenedor) => (
            <ContenedorCard
              key={contenedor.id}
              contenedor={contenedor}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ContenedorList;
