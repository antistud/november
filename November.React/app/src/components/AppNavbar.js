import React, { Component } from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import db from '../services/db'
export class AppNavbar extends Component {

  // logout = (e, apiKey) => { db.logout(apiKey).then(res => { console.log(res); localStorage.removeItem('apiKey') }) }
  loginbutton() {
    if (localStorage.getItem('apiKey') != null) {
      return <React.Fragment><Navbar.Brand href="/">{this.props.apptitle}</Navbar.Brand>
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
          {/* <NavDropdown title={this.props.username} id="basic-nav-dropdown">
            <NavDropdown.Item href="/" >
              Logout
          </NavDropdown.Item>
          </NavDropdown> */}
          <Navbar.Text>
            Signed in as: <a>{this.props.username}</a>
          </Navbar.Text>
        </Navbar.Collapse></React.Fragment >
    }
    else {
      return <Navbar.Brand href="/">{this.props.apptitle}</Navbar.Brand>
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
