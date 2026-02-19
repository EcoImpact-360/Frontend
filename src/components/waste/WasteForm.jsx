import React, { useState } from "react";
import { validateWasteForm, isFormValid } from "./WasteValidation";

const WasteForm = ({ onAddWaste }) => {
    const [formData, setFormData] = useState({
        title: "",
        body: "",
        userId: 1,
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === "userId" ? Number(value) : value,
        });

        // Limpiar error del campo modificado
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: "",
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar formulario
        const validationErrors = validateWasteForm(formData);
        setErrors(validationErrors);

        if (!isFormValid(validationErrors)) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Enviar datos a JSONPlaceholder
            const response = await fetch(
                "https://jsonplaceholder.typicode.com/posts",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                },
            );

            const data = await response.json();

            // Agregar timestamp local
            const wasteWithDate = {
                ...data,
                createdAt: new Date().toISOString(),
            };

            onAddWaste(wasteWithDate);

            // Limpiar formulario
            setFormData({
                title: "",
                body: "",
                userId: 1,
            });

            alert("Registro de residuo creado exitosamente!");
        } catch (error) {
            console.error("Error al enviar el formulario:", error);
            alert("Error al crear el registro");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="waste-form-container">
            <h2>📝 Registrar Nuevo Residuo</h2>
            <form onSubmit={handleSubmit} className="waste-form">
                <div className="form-group">
                    <label htmlFor="title">Título del Residuo:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Ej: Residuos plásticos"
                        className={errors.title ? "input-error" : ""}
                    />
                    {errors.title && (
                        <span className="error-message">{errors.title}</span>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="body">Descripción:</label>
                    <textarea
                        id="body"
                        name="body"
                        value={formData.body}
                        onChange={handleChange}
                        placeholder="Describe el tipo de residuo y cantidad"
                        rows="4"
                        className={errors.body ? "input-error" : ""}
                    />
                    {errors.body && <span className="error-message">{errors.body}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="userId">Usuario ID:</label>
                    <select
                        id="userId"
                        name="userId"
                        value={formData.userId}
                        onChange={handleChange}
                        className={errors.userId ? "input-error" : ""}
                    >
                        {[...Array(10)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                                Usuario {i + 1}
                            </option>
                        ))}
                    </select>
                    {errors.userId && (
                        <span className="error-message">{errors.userId}</span>
                    )}
                </div>

                <button type="submit" disabled={isSubmitting} className="submit-btn">
                    {isSubmitting ? "Enviando..." : "Registrar Residuo"}
                </button>
            </form>
        </div>
    );
};

export default WasteForm;
