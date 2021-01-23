import React, { useEffect, useState } from "react";
import Axios from "axios";

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

  return (
    <Aux>
      <h1>{portfolio.name}</h1>
    </Aux>
  );
};

export default Portfolio;
