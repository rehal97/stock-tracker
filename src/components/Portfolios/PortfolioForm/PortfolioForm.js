import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import Aux from "../../../hoc/Aux/Aux";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Axios from "axios";

const instance = Axios.create({
  baseURL: "https://radiant-bastion-21109.herokuapp.com/",
});

const PortfolioForm = () => {
  // get user info from Auth0
  const { user } = useAuth0();

  const [portfolioName, setPortfolioName] = useState("");

  const createPortfolio = () => {
    //check if required form field is valid
    if (portfolioName === "") {
      // TODO: display message to enter name
    }

    instance
      .post("/api/portfolios", {
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
  };

  return (
    <Aux>
      <Form onSubmit={createPortfolio}>
        <Form.Group controlId="formPortfolioName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Portfolio Name"
            onChange={(event) => setPortfolioName(event.target.value)}
          />
        </Form.Group>

        <hr width="100%" />
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </Aux>
  );
};

export default PortfolioForm;
