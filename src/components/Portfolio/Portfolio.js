import React, { useEffect, useMemo, useState } from "react";
import Axios from "axios";

import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";

import Aux from "../../hoc/Aux/Aux";
import PortfolioFormModal from "./PortfolioForm/PortfolioFormModal";

const Portfolio = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    Axios.get("/api/portfolios")
      .then((res) => {
        console.log(res);
        setPortfolios(res.data);
      })
      .catch(() => {
        console.log("Could not fetch portfolios");
      });
  }, [showModal]);

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
                <tr key={portfolio.name}>
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

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  return (
    <Aux>
      <Container className="mt-3">
        <Row>
          <Col>
            <h2>Portfolios</h2>
          </Col>
          <Col>
            <Button
              className="float-right"
              variant="primary"
              onClick={handleShow}
            >
              Create
            </Button>
          </Col>
        </Row>
      </Container>

      <hr />

      {getPortfolios}

      <PortfolioFormModal
        showModal={showModal}
        handleShow={handleShow}
        handleClose={handleClose}
      />
    </Aux>
  );
};

export default Portfolio;
