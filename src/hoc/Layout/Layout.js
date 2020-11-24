import React from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

import Aux from "../Aux/Aux";
import AuthenticationButton from "../../components/Auth/AuthenticationButton";

const Layout = (props) => (
  <Aux>
    <Navbar
      className="justify-content-center"
      bg="dark"
      variant="dark"
      expand="lg"
    >
      <Navbar.Brand href="/">Stock Tracker</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />

      <Navbar.Collapse id="basic-navbar-nav">
        <Nav>
          <Nav.Link href="/markets">Markets</Nav.Link>
          <Nav.Link href="/crypto">Crypto</Nav.Link>
          <Nav.Link href="/watchlist">Watchlist</Nav.Link>
          <Nav.Link href="/search">Search</Nav.Link>
          {/* <AuthenticationButton /> */}
          <div className="navbar-nav ml-auto">
            <AuthenticationButton />
          </div>
        </Nav>
      </Navbar.Collapse>
    </Navbar>

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
