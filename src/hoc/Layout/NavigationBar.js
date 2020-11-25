import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

import AuthenticationButton from "../../components/Auth/AuthenticationButton";

const NavigationBar = () => (
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
        <AuthenticationButton />
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

export default NavigationBar;
