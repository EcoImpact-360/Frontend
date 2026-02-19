import React, { useState, useEffect } from 'react';

/**
 * ModalContenedor - TK-001-09
 * Modal genérico para agregar/editar contenedor
 * Formulario con campos: ubicación, capacidad, tipo, etc.
 */
function ModalContenedor({ isOpen, onClose, onSave, contenedor }) {
  const [formData, setFormData] = useState({
    name: '',
    ubicacion: '',
    capacidad_max: 500,
    nivel_actual: 0,
    depositos_por_aula: [],
    ultima_vaciada: new Date().toISOString().split('T')[0],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar datos del contenedor cuando se edita
  useEffect(() => {
    if (contenedor) {
      setFormData({
        name: contenedor.name || '',
        ubicacion: contenedor.ubicacion || '',
        capacidad_max: contenedor.capacidad_max || 500,
        nivel_actual: contenedor.nivel_actual || 0,
        depositos_por_aula: contenedor.depositos_por_aula || [],
        ultima_vaciada: contenedor.ultima_vaciada || new Date().toISOString().split('T')[0],
      });
    } else {
      // Reset form cuando es nuevo
      setFormData({
        name: '',
        ubicacion: '',
        capacidad_max: 500,
        nivel_actual: 0,
        depositos_por_aula: [],
        ultima_vaciada: new Date().toISOString().split('T')[0],
      });
    }
  }, [contenedor, isOpen]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSave(formData);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calcular porcentaje
  const porcentaje = formData.capacidad_max > 0
    ? Math.round((formData.nivel_actual / formData.capacidad_max) * 100)
    : 0;

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '1.5rem',
          width: '90%',
          maxWidth: '500px',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
          }}
        >
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>
            {contenedor ? '✏️ Editar Contenedor' : '+ Agregar Contenedor'}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#6B7280',
            }}
          >
            ×
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          {/* Nombre del contenedor */}
          <div style={{ marginBottom: '1rem' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.375rem',
              }}
            >
              Nombre del Contenedor
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: Contenedor Reciclable Principal"
              style={{
                width: '100%',
                padding: '0.625rem',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '1rem',
              }}
            />
          </div>

          {/* Ubicación */}
          <div style={{ marginBottom: '1rem' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.375rem',
              }}
            >
              Ubicación *
            </label>
            <input
              type="text"
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleChange}
              required
              placeholder="Ej: Patio Central, Zona Norte, Entrada principal..."
              style={{
                width: '100%',
                padding: '0.625rem',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '1rem',
              }}
            />
          </div>

          {/* Capacidad y Nivel */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.375rem',
                }}
              >
                Capacidad Máxima (kg) *
              </label>
              <input
                type="number"
                name="capacidad_max"
                value={formData.capacidad_max}
                onChange={handleChange}
                min="1"
                required
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  border: '1px solid #D1D5DB',
                  borderRadius: '6px',
                  fontSize: '1rem',
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.375rem',
                }}
              >
                Nivel Actual (kg)
              </label>
              <input
                type="number"
                name="nivel_actual"
                value={formData.nivel_actual}
                onChange={handleChange}
                min="0"
                max={formData.capacidad_max}
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  border: '1px solid #D1D5DB',
                  borderRadius: '6px',
                  fontSize: '1rem',
                }}
              />
            </div>
          </div>

          {/* Preview del nivel */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '0.375rem'
            }}>
              <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                Vista previa del nivel
              </span>
              <span style={{ 
                fontSize: '0.75rem', 
                fontWeight: '600',
                color: porcentaje < 60 ? '#10B981' : porcentaje <= 80 ? '#F59E0B' : '#EF4444'
              }}>
                {porcentaje}%
              </span>
            </div>
            <div
              style={{
                width: '100%',
                height: '10px',
                background: '#E5E7EB',
                borderRadius: '5px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${Math.min(porcentaje, 100)}%`,
                  height: '100%',
                  background: porcentaje < 60 ? '#10B981' : porcentaje <= 80 ? '#F59E0B' : '#EF4444',
                  borderRadius: '5px',
                  transition: 'width 0.3s',
                }}
              />
            </div>
          </div>

          {/* Última vaciada */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.375rem',
              }}
            >
              Última Vaciada
            </label>
            <input
              type="date"
              name="ultima_vaciada"
              value={formData.ultima_vaciada}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.625rem',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '1rem',
              }}
            />
          </div>

          {/* Botones */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.625rem 1.25rem',
                background: '#F3F4F6',
                color: '#374151',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '0.625rem 1.25rem',
                background: isSubmitting ? '#9CA3AF' : '#10B981',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}
            >
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalContenedor;
