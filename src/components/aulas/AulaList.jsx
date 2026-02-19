import React from 'react';
import AulaCard from './AulaCard';

/**
 * AulaList - TK-001-03
 * Componente que mapea y renderiza dinámicamente todas las aulas en grilla
 * Las aulas están ordenadas alfabéticamente por nombre
 */
function AulaList({ aulas, onEdit, onDelete, onAdd }) {
  // Ordenar aulas alfabéticamente por nombre (Criterio de Aceptación Escenario 1)
  const aulasOrdenadas = [...(aulas || [])].sort((a, b) => {
    const nombreA = (a.name || '').toLowerCase();
    const nombreB = (b.name || '').toLowerCase();
    return nombreA.localeCompare(nombreB);
  });

  if (!aulas || aulas.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '3rem',
          background: '#F9FAFB',
          borderRadius: '12px',
          border: '2px dashed #E5E7EB',
        }}
      >
        <p style={{ color: '#6B7280', fontSize: '1rem', marginBottom: '1rem' }}>
          📚 No hay aulas registradas
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
          + Agregar Primera Aula
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Botón agregar aula (Criterio de Aceptación Escenario 2) */}
      <div style={{ marginBottom: '1.5rem' }}>
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
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => e.target.style.background = '#059669'}
          onMouseLeave={(e) => e.target.style.background = '#10B981'}
        >
          <span style={{ fontSize: '1.25rem' }}>+</span> Agregar Aula
        </button>
      </div>

      {/* Título de la sección */}
      <h2
        style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          color: '#111827',
          marginBottom: '1rem',
        }}
      >
        📚 Aulas Registradas ({aulasOrdenadas.length})
      </h2>

      {/* Grilla de tarjetas de aulas - Responsive (Criterio de Aceptación Escenario 1) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {aulasOrdenadas.map((aula) => (
          <AulaCard
            key={aula.id}
            aula={aula}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

export default AulaList;
