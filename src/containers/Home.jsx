import React from 'react';
import { FavIcon } from '../assets';
import '../scss/App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <FavIcon className="App-logo" alt="logo" />
        <p>
          React App
        </p>
      </header>
    </div>
  );
}

export default App;