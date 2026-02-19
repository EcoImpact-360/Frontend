import { BrowserRouter } from 'react-router-dom';
import Router from './router';

// Wraps the app with BrowserRouter to enable client-side navigation.
function App() {
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
}

export default App;
