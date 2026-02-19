import React, { useState, useEffect } from 'react';
import WasteForm from './components/waste/WasteForm';
import WasteTable from './components/waste/WasteTable';
import WasteHistory from './components/waste/WasteHistory';
import "./App.css";

function App() {
  const [wastes, setWastes] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts?_limit=5')
      .then(response => response.json())
      .then(data => {
        setWastes(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al cargar datos:', error);
        setLoading(false);
      });
  }, []);

  const handleAddWaste = (newWaste) => {
    setWastes([newWaste, ...wastes]);
    setHistory([{ type: 'added', title: newWaste.title, timestamp: new Date().toISOString() }, ...history]);
  };

  const handleDeleteWaste = (id) => {
    const wasteToDelete = wastes.find(w => w.id === id);
    setWastes(wastes.filter(waste => waste.id !== id));
    setHistory([{ type: 'deleted', title: wasteToDelete.title, timestamp: new Date().toISOString() }, ...history]);
  };

  if (loading) {
    return <div className="loading">Cargando datos...</div>;
  }

  return (
    <div className="App">
      <header className="appHeader">
        <h1>♻️ Sistema de Gestión de Residuos</h1>
        <p>Administra y registra los residuos de tu organización</p>
      </header>

      <div className="appContainer">
        <div className="mainSection">
          <WasteForm onAddWaste={handleAddWaste} />
          <WasteTable wastes={wastes} onDelete={handleDeleteWaste} />
        </div>

        <aside className="sidebar">
          <WasteHistory history={history} />
        </aside>
      </div>
    </div>
  );
}

export default App;