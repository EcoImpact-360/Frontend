import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Toast from './components/alerts/Toast';
import NavBar from './components/layout/NavBar';
import { AuthProvider } from './context/AuthContext';
import Router from './router';
function App() {
  const [toast, setToast] = useState({ message: null, type: 'success' });
  const hideToast = () => {
    setToast({ ...toast, message: null });
  };
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavBar />
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
        <Router />
      </BrowserRouter>
    </AuthProvider>
  );
}
export default App;
