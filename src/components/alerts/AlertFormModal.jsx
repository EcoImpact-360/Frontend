import React, { useEffect, useRef, useState } from 'react';
const EMPTY_FORM = { classroomId: '', wasteTypeId: '', title: '', message: '', totalKg: '' };
export default function AlertFormModal({
  open,
  mode = 'create',
  initialValues,
  classrooms = [],
  wasteTypes = [],
  loading,
  onClose,
  onSubmit,
}) {
  const isEdit = mode === 'edit';
  const [form, setForm] = useState(() =>
    isEdit && initialValues
      ? {
          classroomId: initialValues.classroomId != null ? String(initialValues.classroomId) : '',
          wasteTypeId: initialValues.wasteTypeId != null ? String(initialValues.wasteTypeId) : '',
          title: initialValues.title || '',
          message: initialValues.message || '',
          totalKg: initialValues.totalKg != null ? String(initialValues.totalKg) : '',
        }
      : EMPTY_FORM
  );
  const [formError, setFormError] = useState('');
  const titleRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    const focusTimer = window.setTimeout(() => titleRef.current?.focus(), 0);
    return () => window.clearTimeout(focusTimer);
  }, [open]);
  if (!open) {
    return null;
  }
  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');
    if (!isEdit && !form.classroomId) {
      setFormError('Selecciona un aula para la alerta.');
      return;
    }
    if (!form.title.trim()) {
      setFormError('El titulo de la alerta es obligatorio.');
      return;
    }
    if (form.totalKg && (!Number.isFinite(Number(form.totalKg)) || Number(form.totalKg) < 0)) {
      setFormError('La cantidad en kg debe ser un numero valido.');
      return;
    }
    const payload = isEdit
      ? {
          title: form.title.trim(),
          message: form.message.trim() || null,
          totalKg: form.totalKg ? Number(form.totalKg) : null,
        }
      : {
          classroomId: Number(form.classroomId),
          wasteTypeId: form.wasteTypeId ? Number(form.wasteTypeId) : null,
          title: form.title.trim(),
          message: form.message.trim() || null,
          totalKg: form.totalKg ? Number(form.totalKg) : null,
          alertType: 'CUSTOM',
        };
    try {
      await onSubmit(payload);
    } catch (err) {
      setFormError(err?.message || 'No se pudo guardar la alerta.');
    }
  };
  return (
    <div onClick={loading ? undefined : onClose} role="presentation" className="modal-overlay">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isEdit ? 'Editar alerta' : 'Crear alerta'}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        onClick={(event) => event.stopPropagation()}
        className="surface-card modal-card"
      >
        <h2 className="modal-title">{isEdit ? 'Editar alerta' : 'Nueva alerta'}</h2>
        <form className="modal-form" onSubmit={handleSubmit}>
          {!isEdit && (
            <label className="alerts-field">
              <span>Aula</span>
              <select className="alerts-select" value={form.classroomId} onChange={handleChange('classroomId')}>
                <option value="">Selecciona un aula</option>
                {classrooms.map((classroom) => (
                  <option key={classroom.id} value={classroom.id}>
                    {classroom.name}
                  </option>
                ))}
              </select>
            </label>
          )}
          {!isEdit && (
            <label className="alerts-field">
              <span>Tipo de residuo (opcional)</span>
              <select className="alerts-select" value={form.wasteTypeId} onChange={handleChange('wasteTypeId')}>
                <option value="">Sin especificar</option>
                {wasteTypes.map((wasteType) => (
                  <option key={wasteType.id} value={wasteType.id}>
                    {wasteType.name}
                  </option>
                ))}
              </select>
            </label>
          )}
          <label className="alerts-field">
            <span>Titulo</span>
            <input
              ref={titleRef}
              className="alerts-input"
              type="text"
              placeholder="Ej: Contenedor de papel desbordado"
              value={form.title}
              onChange={handleChange('title')}
            />
          </label>
          <label className="alerts-field">
            <span>Mensaje (opcional)</span>
            <input
              className="alerts-input"
              type="text"
              placeholder="Detalles adicionales"
              value={form.message}
              onChange={handleChange('message')}
            />
          </label>
          <label className="alerts-field">
            <span>Cantidad en kg (opcional)</span>
            <input
              className="alerts-input"
              type="number"
              min="0"
              step="0.1"
              placeholder="Ej: 5"
              value={form.totalKg}
              onChange={handleChange('totalKg')}
            />
          </label>
          {formError && <p className="alerts-form-error">{formError}</p>}
          <div className="modal-actions">
            <button type="button" className="alerts-btn-secondary" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="alerts-btn" disabled={loading}>
              {loading ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear alerta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
