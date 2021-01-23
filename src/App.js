import React from "react";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";

import "./App.css";

import Layout from "./hoc/Layout/Layout";
import SymbolSearch from "./components/SymbolSearch/SymbolSearch";
import SymbolInfo from "./components/SymbolInfo/SymbolInfo";
import Portfolio from "./components/Portfolios/Portfolio/Portfolio";
import Portfolios from "./components/Portfolios/Portfolios";

const App = (props) => {
  let routes = (
    <Switch>
      <Route path="/" exact component={SymbolSearch} />
      <Route path={"/symbol"} component={SymbolInfo} />
      <Route path={"/search"} component={SymbolSearch} />
      <Route path={"/portfolio"} component={Portfolio} />
      <Route path={"/portfolios"} component={Portfolios} />
      <Route path={"/markets"} render={() => <h1>Under Construction</h1>} />
      <Route path={"/crypto"} render={() => <h1>Under Construction</h1>} />
      <Route
        path={"/watchlist"}
        render={() => <h1>Watchlist Coming Soon</h1>}
      />
      <Redirect to="/" />
    </Switch>
  );

  return <Layout>{routes}</Layout>;
};

export default withRouter(App);
