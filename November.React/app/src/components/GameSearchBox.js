import React, { Component } from "react";
import { Button, Form, FormControl } from "react-bootstrap";
export class GameSearchBox extends Component {
  state = { searchstring: "" };

  onChange = e => this.setState({ [e.target.name]: e.target.value });
  onSubmit = e => {
    e.preventDefault();
    this.props.gameSearch(this.state.searchstring);
    this.setState({ searchstring: "" });
  };
  render() {
    return (
      <Form onSubmit={this.onSubmit} inline>
        <FormControl
          type="text"
          placeholder="Search"
          className="mr-sm-2"
          value={this.state.searchstring}
          name="searchstring"
          onChange={this.onChange}
        />
        <Button variant="outline-success" type="submit">
          Search
        </Button>
      </Form>
    );
  }
}

export default GameSearchBox;
