import React, { Component } from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import db from '../services/SearchGames'
export class AppNavbar extends Component {
  render() {
    return (
      <Navbar sticky="top" bg="light" expand="lg">
        <Navbar.Brand href="/">{this.props.apptitle}</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="about">About</Nav.Link>

            <NavDropdown title="More" id="basic-nav-dropdown">
              <NavDropdown.Item href="/gamesearch">
                Game Search
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            Signed in as: <a>{this.props.username}</a>
          </Navbar.Text>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default AppNavbar;
