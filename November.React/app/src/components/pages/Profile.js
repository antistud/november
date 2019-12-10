import React, { Component } from "react";
import { Table, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProfileEdit from "./ProfileEdit";

function Profile(props) {
  const state = {
    name: null,
    email: null,
    address: null,
    city: null,
    state: null
  };
  let onChange = e => this.setState({ [e.target.name]: e.target.value });
  let onSubmit = e => {
    e.preventDefault();
    this.props.gameSearch(this.state.searchstring);
    this.setState({ searchstring: "" });
  };
  return (
    <React.Fragment>
      <div>
        <h2>
          <span>
            <FontAwesomeIcon icon="user-circle" />
            {props.profile.name}
          </span>
          <span style={{ float: "right" }}>
            <Button variant="primary">
              <FontAwesomeIcon icon="user-edit" />
            </Button>
          </span>
        </h2>
      </div>
      <Table striped bordered>
        <thead>
          <tr>
            <th>Username</th>
            <th>{props.profile.username}</th>
          </tr>
          <tr>
            <th>Email</th>
            <th>{props.profile.email}</th>
          </tr>
          <tr>
            <th>Address</th>
            <th>
              {props.profile.address},{props.profile.city},{props.profile.state}
            </th>
          </tr>
          <tr>
            <th>City</th>
            <th>{props.profile.city}</th>
          </tr>
          <tr>
            <th>State</th>
            <th>{props.profile.state}</th>
          </tr>
        </thead>

        {/* <tbody>{this.props.renderTableData()}</tbody> */}
      </Table>
    </React.Fragment>
  );
}

export default Profile;
