import React, { useEffect, useMemo, useState } from "react";
import Axios from "axios";

import Table from "react-bootstrap/Table";

import Aux from "../../../hoc/Aux/Aux";

const Portfolio = (props) => {
  const [portfolio, setPortfolio] = useState({});

  const getPortfolio = (id) => {
    Axios.get("/api/portfolios/name", {
      params: {
        id,
      },
    })
      .then((res) => {
        setPortfolio(res.data);
      })
      .catch((err) => {
        console.log("Could not fetch portfolio.");
      });
  };

  useEffect(() => {
    console.log(props.location.id);
    getPortfolio(props.location.id);
  }, []);

  const renderHoldings = useMemo(() => {
    if (portfolio.holdings === undefined || portfolio.holdings.length === 0) {
      return <p>You currently have 0 holdings in this portfolio.</p>;
    } else {
      const holdings = portfolio.holdings;

      return (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Current Price</th>
              <th>Change</th>
              <th>Change (%)</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((holding) => {
              <tr key={holding.name}>
                <td>{holding.name}</td>
              </tr>;
            })}
          </tbody>
        </Table>
      );
    }
  }, [portfolio]);

  return (
    <Aux>
      <h1>{portfolio.name}</h1>
      {renderHoldings}
    </Aux>
  );
};

export default Portfolio;
