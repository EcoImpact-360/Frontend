import React from 'react';

const WasteHistory = ({ history }) => {
    return (
        <div className="waste-history-container">
            <h2>📜 Historial de Operaciones</h2>
            {history.length === 0 ? (
                <p className="empty-message">No hay operaciones en el historial.</p>
            ) : (
                <div className="history-list">
                    {history.map((entry, index) => (
                        <div key={index} className={`history-item ${entry.type}`}>
                            <span className="history-icon">
                                {entry.type === 'added' ? '➕' : '🗑️'}
                            </span>
                            <div className="history-content">
                                <strong>{entry.type === 'added' ? 'Agregado' : 'Eliminado'}:</strong> {entry.title}
                                <br />
                                <small>{new Date(entry.timestamp).toLocaleString('es-ES')}</small>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WasteHistory;