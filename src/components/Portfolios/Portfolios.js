import React, { useCallback, useEffect, useMemo, useState } from "react";
import Axios from "axios";

import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";

import Aux from "../../hoc/Aux/Aux";
import PortfolioFormModal from "./PortfolioForm/PortfolioFormModal";

const Portfolio = (props) => {
  const [portfolios, setPortfolios] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getPortfolios();
  }, [showModal]);

  const getPortfolios = () => {
    console.log("getting portfolios");
    Axios.get("/api/portfolios")
      .then((res) => {
        setPortfolios(res.data);
      })
      .catch(() => {
        console.log("Could not fetch portfolios");
      });
  };

  const deletePortfolio = (id) => {
    Axios.post(`/api/portfolios/delete`, null, {
      params: {
        id,
      },
    })
      .then((res) => {
        getPortfolios();
      })
      .catch((err) => console.log(err.message));
  };

  const redirectToPortfolioPage = useCallback(
    (name, id) => {
      props.history.push({
        pathname: "/portfolio/" + name,
        symbol: name,
        id: id,
      });
    },
    [props.history]
  );

  const renderPortfolios = useMemo(() => {
    if (portfolios || portfolios.length === 0) {
      console.log(portfolios);
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
                console.log(portfolio);
                return (
                  <tr
                    key={portfolio._id}
                    onClick={() =>
                      redirectToPortfolioPage(portfolio.name, portfolio._id)
                    }
                  >
                    <td>{portfolio.name}</td>
                    <td>{portfolio.holdings.length}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Aux>
      );
    } else {
      return <p>You currently have no portfolios created.</p>;
    }
  }, [portfolios, deletePortfolio]);

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

      {renderPortfolios}

      <PortfolioFormModal
        showModal={showModal}
        handleShow={handleShow}
        handleClose={handleClose}
      />
    </Aux>
  );
};

export default Portfolio;
