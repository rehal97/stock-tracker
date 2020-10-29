import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import './App.css';

import TickerSearch from './components/TickerSearch/TickerSearch';

const App = () => {

  let routes = (
    <Switch>
      <Route path="/" exact component={TickerSearch} />
      {/* <Route path="/ticker" component={} /> */}
      <Redirect to="/" />
    </Switch>
  )

  return (
    <div className="App">
      {routes}
    </div>
  );
}

export default App;
