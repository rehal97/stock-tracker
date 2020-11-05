import React from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';

import './App.css';

import Layout from './hoc/Layout/Layout';
import TickerSearch from './components/TickerSearch/TickerSearch';
import TickerInfo from './components/TickerInfo/TickerInfo';

const App = (props) => {

  let routes = (
    <Switch>
      <Route path="/" exact component={TickerSearch} />
      <Route path={'/ticker'} component={TickerInfo} />
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
