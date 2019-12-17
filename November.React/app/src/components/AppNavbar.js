import React, { Component } from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import Auth from "../services/auth";

export class AppNavbar extends Component {
  logout = e => {
    Auth.logout(this.props.apiKey).then(res => {
      localStorage.removeItem("apiKey");
      this.props.loggedIn(false);
    });
  };

  loginbutton() {
    if (localStorage.getItem("apiKey") != null) {
      return (
        <React.Fragment>
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
          <Navbar.Collapse className="justify-content-end basic-navbar-nav">
            <Nav>
              <NavDropdown title={this.props.username} id="basic-nav-dropdown">
                <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
                <NavDropdown.Item href="/requests">Manage Requests</NavDropdown.Item>
                <NavDropdown.Item onClick={() => this.logout()}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
            {/* <Navbar.Text onClick={() => this.logout()}>
              {this.props.username}
            </Navbar.Text> */}
          </Navbar.Collapse>
        </React.Fragment>
      );
    } else {
      return <Navbar.Brand href="/">{this.props.apptitle}</Navbar.Brand>;
    }
  }
  render() {
    return (
      <Navbar sticky="top" bg="light" expand="lg">
        {this.loginbutton()}
      </Navbar>
    );
  }
}

export default AppNavbar;
