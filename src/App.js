import React from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';

import './App.css';

import Layout from './hoc/Layout/Layout';
import SymbolSearch from './components/SymbolSearch/SymbolSearch';
import SymbolInfo from './components/SymbolInfo/SymbolInfo';

const App = (props) => {

  let routes = (
    <Switch>
      <Route path="/" exact component={SymbolSearch} />
      <Route path={'/symbol'} component={SymbolInfo} />
      <Redirect to="/" />
    </Switch>
  )

  return (
    <Layout>
      {routes}
    </Layout>
  );
}

export default withRouter(App);
