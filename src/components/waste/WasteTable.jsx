import React from 'react';

const WasteTable = ({ wastes, onDelete }) => {
    return (
        <div className="waste-table-container">
            <h2>📊 Lista de Residuos Actual</h2>
            {wastes.length === 0 ? (
                <p className="empty-message">No hay residuos registrados actualmente.</p>
            ) : (
                <table className="waste-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Título</th>
                            <th>Descripción</th>
                            <th>Usuario</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {wastes.map((waste) => (
                            <tr key={waste.id}>
                                <td>{waste.id}</td>
                                <td>{waste.title}</td>
                                <td>{waste.body}</td>
                                <td>Usuario {waste.userId}</td>
                                <td>
                                    <button
                                        onClick={() => onDelete(waste.id)}
                                        className="delete-btn"
                                    >
                                        🗑️ Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default WasteTable;