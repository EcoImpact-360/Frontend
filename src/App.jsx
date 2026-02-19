import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Toast from './components/alerts/Toast'; // Importamos tu componente Toast corregido
import Router from './router';

function App() {
  // Estado global para las notificaciones
  const [toast, setToast] = useState({ message: null, type: 'success' });


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