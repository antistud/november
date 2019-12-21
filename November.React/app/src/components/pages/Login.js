import React, { Component } from "react";

import queryString from "query-string";
import { Form, Button } from "react-bootstrap";

export class Login extends Component {
  constructor(props) {
    super(props);
    const values = queryString.parse(window.location.search);
    if (values.e && values.p) {
      this.setState({ username: values.e, password: values.p });
      this.props.authorize({ username: values.e, password: values.p });
    }
  }

  state = { username: "", password: "" };
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  onSubmit = e => {
    e.preventDefault();
    this.props.authorize(this.state);

    this.setState({ username: "", password: "" });
  };
  render() {
    return (
      <React.Fragment>
        <Form onSubmit={this.onSubmit}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="username"
              onChange={this.onChange}
            />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
              onChange={this.onChange}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </React.Fragment>
    );
  }
}

export default Login;
