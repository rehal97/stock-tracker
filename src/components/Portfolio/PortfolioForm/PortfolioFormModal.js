import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import Aux from "../../../hoc/Aux/Aux";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Axios from "axios";

const PortfolioFormModal = (props) => {
  // get user info from Auth0
  const { user } = useAuth0();

  const [portfolioName, setPortfolioName] = useState("");

  const createPortfolio = () => {
    //check if required form field is valid
    if (portfolioName === "") {
      // TODO: display message to enter name
    }

    Axios.post("/api/portfolios", {
      name: portfolioName,
      owner: user.email,
    })
      .then(() => {
        // portfolio created successfully
        // TODO: display success message
        console.log("portfolio created");
      })
      .catch(() => {
        // TODO: display error message
        console.log("Could not create portfolio. Please try again");
      });
    console.log("form submitted " + portfolioName);
    props.handleClose();
  };

  return (
    <Modal show={props.showModal} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create Portfolio</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formPortfolioName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Portfolio Name"
              onChange={(event) => setPortfolioName(event.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={createPortfolio}>
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PortfolioFormModal;
