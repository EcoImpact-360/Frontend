import React, { useState, useEffect } from 'react';

/**
 * ModalAula - TK-001-08
 * Modal genérico para agregar/editar aula
 * Formulario con campos: nombre, ubicación, valores iniciales kg (opcional)
 */
function ModalAula({ isOpen, onClose, onSave, aula }) {
  const [formData, setFormData] = useState({
    name: '',
    cubos_por_dia: [
      { dia: 'lunes', cubos_basura: 0, cubos_reciclables: 0 },
      { dia: 'martes', cubos_basura: 0, cubos_reciclables: 0 },
      { dia: 'miércoles', cubos_basura: 0, cubos_reciclables: 0 },
      { dia: 'jueves', cubos_basura: 0, cubos_reciclables: 0 },
      { dia: 'viernes', cubos_basura: 0, cubos_reciclables: 0 },
    ],
    gestor_id: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar datos del aula cuando se edita
  useEffect(() => {
    if (aula) {
      setFormData({
        name: aula.name || '',
        cubos_por_dia: aula.cubos_por_dia || formData.cubos_por_dia,
        gestor_id: aula.gestord_id || null,
      });
    } else {
      // Reset form cuando es nuevo
      setFormData({
        name: '',
        cubos_por_dia: [
          { dia: 'lunes', cubos_basura: 0, cubos_reciclables: 0 },
          { dia: 'martes', cubos_basura: 0, cubos_reciclables: 0 },
          { dia: 'miércoles', cubos_basura: 0, cubos_reciclables: 0 },
          { dia: 'jueves', cubos_basura: 0, cubos_reciclables: 0 },
          { dia: 'viernes', cubos_basura: 0, cubos_reciclables: 0 },
        ],
        gestor_id: null,
      });
    }
  }, [aula, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDiaChange = (index, field, value) => {
    const newCubos = [...formData.cubos_por_dia];
    newCubos[index] = {
      ...newCubos[index],
      [field]: parseInt(value, 10) || 0,
    };
    
    // Calcular total automáticamente
    const total = newCubos.reduce((sum, dia) => sum + dia.cubos_basura + dia.cubos_reciclables, 0);
    
    setFormData((prev) => ({
      ...prev,
      cubos_por_dia: newCubos,
      total_cubos_semana: total,
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
          maxWidth: '600px',
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
            {aula ? '✏️ Editar Aula' : '+ Agregar Aula'}
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
          {/* Nombre del aula */}
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
              Nombre del Aula *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Ej: Aula 1, Laboratorio, Biblioteca..."
              style={{
                width: '100%',
                padding: '0.625rem',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '1rem',
              }}
            />
          </div>

          {/* Valores por día */}
          <div style={{ marginBottom: '1rem' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem',
              }}
            >
              Cubos por Día (opcional)
            </label>
            
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {formData.cubos_por_dia.map((dia, index) => (
                <div
                  key={dia.dia}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '100px 1fr 1fr',
                    gap: '0.5rem',
                    alignItems: 'center',
                    padding: '0.5rem',
                    background: '#F9FAFB',
                    borderRadius: '6px',
                  }}
                >
                  <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                    {dia.dia}
                  </span>
                  <div>
                    <input
                      type="number"
                      min="0"
                      value={dia.cubos_basura}
                      onChange={(e) => handleDiaChange(index, 'cubos_basura', e.target.value)}
                      placeholder="Basura"
                      style={{
                        width: '100%',
                        padding: '0.375rem',
                        border: '1px solid #D1D5DB',
                        borderRadius: '4px',
                        fontSize: '0.875rem',
                      }}
                    />
                    <span style={{ fontSize: '0.625rem', color: '#6B7280' }}>Basura</span>
                  </div>
                  <div>
                    <input
                      type="number"
                      min="0"
                      value={dia.cubos_reciclables}
                      onChange={(e) => handleDiaChange(index, 'cubos_reciclables', e.target.value)}
                      placeholder="Reciclables"
                      style={{
                        width: '100%',
                        padding: '0.375rem',
                        border: '1px solid #D1D5DB',
                        borderRadius: '4px',
                        fontSize: '0.875rem',
                      }}
                    />
                    <span style={{ fontSize: '0.625rem', color: '#6B7280' }}>Reciclables</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div
            style={{
              background: '#EEF2FF',
              padding: '0.75rem',
              borderRadius: '6px',
              marginBottom: '1.5rem',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: '0.875rem', color: '#4F46E5', fontWeight: '500' }}>
              Total Semana: {formData.total_cubos_semana || 0} cubos
            </span>
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

export default ModalAula;
