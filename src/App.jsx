import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Toast from './components/alerts/Toast'; 
import Router from './router';

function App() {
  const [toast, setToast] = useState({ message: null, type: 'success' });


  const hideToast = () => {
    setToast({ ...toast, message: null });
  };

  return (
    <BrowserRouter>
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />

      <Router />
    </BrowserRouter>
  );
}

export default App;