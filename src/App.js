import React, { useEffect, useState } from 'react';
import './App.css';

import TickerSearch from './components/TickerSearch/TickerSearch';

const App = () => {
  return (
    <div className="App">
      <h1>Stock Tracker</h1>
      <TickerSearch />
    </div>
  );
}

export default App;
