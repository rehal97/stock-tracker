import React from "react";
import Form from "react-bootstrap/Form";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

import classes from "./NavigationBar.module.css";

import AuthenticationButton from "../../components/Auth/AuthenticationButton";

const NavigationBar = () => (
  <Navbar bg="dark" variant="dark" expand="lg">
    <Navbar.Brand href="/">Stock Tracker</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />

    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className={classes.NavbarItems}>
        <Nav.Link href="/markets">Markets</Nav.Link>
        <Nav.Link href="/portfolios">Portfolio</Nav.Link>
        <Nav.Link href="/watchlist">Watchlist</Nav.Link>
        <Nav.Link href="/search">Search</Nav.Link>
      </Nav>
    </Navbar.Collapse>
    <Form>
      <AuthenticationButton />
    </Form>
  </Navbar>
);

export default NavigationBar;
