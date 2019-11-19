import React, { useState } from "react";

import Jumbotron from "react-bootstrap/Jumbotron";
import Toast from "react-bootstrap/Toast";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import "./App.css";
import { Switch, Route, Link } from 'react-router-dom'

const ExampleToast = ({ children }) => {
  const [show, toggleShow] = useState(true);

  return (
    <Toast show={show} onClose={() => toggleShow(!show)}>
      <Toast.Header>
        <strong className="mr-auto">React-Bootstrap</strong>
      </Toast.Header>
      <Toast.Body>{children}</Toast.Body>
    </Toast>
  );
};



const NavBarExample = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#home">Tabletop Share</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <NavDropdown title="Menu" id="basic-nav-dropdown">
            <NavDropdown.Item><Link to='/schedule'>Schedule</Link></NavDropdown.Item>
            <NavDropdown.Item >
              <Link to='/roster'>Roster</Link>
            </NavDropdown.Item>
            <NavDropdown.Item ><Link to='/'>Home</Link></NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#action/3.4">
              Separated link
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

function Main() {
  return (
    <main>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/roster' component={Roster} />
        <Route path='/schedule' component={Schedule} />
      </Switch>
    </main>
  );
}
const Home = () => (
  <div>
    <p>Home</p>
  </div>

);
const Roster = () => (
  <div>
    <p>Roster</p>
  </div>

);
const Schedule = () => (
  <div>
    <p>Schedule</p>
  </div>

);
const App = () => (
  <div>

    <NavBarExample />
    <Main />


  </div>

);

export default App;
