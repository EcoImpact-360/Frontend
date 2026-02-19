import { BrowserRouter } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Router from './router';
import Toast from './components/alerts/Toast'; // Importamos tu componente Toast corregido

function App() {
  // Estado global para las notificaciones
  const [toast, setToast] = useState({ message: null, type: 'success' });

  // Función global para mostrar mensajes (opcional: puedes usar Context API si el proyecto crece)
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast({ ...toast, message: null });
  };

  return (
    <BrowserRouter>
      {/* El Toast se renderiza sobre toda la aplicación */}
      <Toast 
        message={toast.message} 
        type={toast.type} 
        onClose={hideToast} 
      />
      
      {/* Pasamos funciones o simplemente dejamos que el Router maneje las vistas */}
      <Router />
    </BrowserRouter>
  );
}

export default App;