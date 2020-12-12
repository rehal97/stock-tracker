import React, { useEffect, useMemo, useState } from "react";

import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";

import Aux from "../../hoc/Aux/Aux";
import Axios from "axios";

const Portfolio = () => {
  const [portfolios, setPortfolios] = useState([]);

  useEffect(() => {
    Axios.get("/api/portfolios")
      .then((res) => {
        console.log(res);
        setPortfolios(res.data);
      })
      .catch(() => {
        console.log("Could not fetch portfolios");
      });
  }, []);

  const getPortfolios = useMemo(() => {
    if (portfolios.length === 0) {
      return <p>You currently have no porfolios created.</p>;
    }
    return (
      <Aux>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th># Holdings</th>
            </tr>
          </thead>
          <tbody>
            {portfolios.map((portfolio) => {
              return (
                <tr>
                  <td>{portfolio.name}</td>
                  <td>{portfolio.stocks.length}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Aux>
    );
  }, [portfolios]);

  return (
    <Aux>
      <Container className="mt-3">
        <Row>
          <Col>
            <h2>Portfolios</h2>
          </Col>
          <Col>
            <Button className="float-right" variant="primary">
              Create
            </Button>
          </Col>
        </Row>
      </Container>

      <hr />
      {getPortfolios}
    </Aux>
  );
};

export default Portfolio;
