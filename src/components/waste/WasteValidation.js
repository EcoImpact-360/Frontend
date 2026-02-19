// Funciones de validación para los formularios

export const validateWasteForm = (formData) => {
    const errors = {};

    if (!formData.title || formData.title.trim() === "") {
        errors.title = "El título es obligatorio";
    }

    if (!formData.body || formData.body.trim() === "") {
        errors.body = "La descripción es obligatoria";
    }

    if (!formData.userId || formData.userId <= 0) {
        errors.userId = "Debe seleccionar un usuario válido";
    }

    return errors;
};

export const isFormValid = (errors) => {
    return Object.keys(errors).length === 0;
};
