import React from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import Aux from "../Aux/Aux";
import Navbar from "./NavigationBar";

const Layout = (props) => (
  <Aux>
    <Navbar />

    <Container>
      <Row>
        <Col></Col>
        <Col xs={8}>{props.children}</Col>
        <Col></Col>
      </Row>
    </Container>
  </Aux>
);

export default Layout;
