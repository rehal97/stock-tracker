import React from "react";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";

import "./App.css";

import Layout from "./hoc/Layout/Layout";
import SymbolSearch from "./components/SymbolSearch/SymbolSearch";
import SymbolInfo from "./components/SymbolInfo/SymbolInfo";

const App = (props) => {
  let routes = (
    <Switch>
      <Route path="/" exact render={() => <h1>Homepage Coming Soon</h1>} />
      <Route path={"/symbol"} component={SymbolInfo} />
      <Route path={"/search"} component={SymbolSearch} />
      <Route path={"/markets"} render={() => <h1>Markets Coming Soon</h1>} />
      <Route path={"/crypto"} render={() => <h1>Crypto Coming Soon</h1>} />
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
