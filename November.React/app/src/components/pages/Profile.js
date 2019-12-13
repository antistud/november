import React, { Component } from "react";
import { Table, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory, useRouteMatch } from "react-router-dom";
function Profile(props) {
  const state = {
    name: null,
    email: null,
    address: null,
    city: null,
    state: null
  };

  let history = useHistory();
  let { url } = useRouteMatch();
  function handleClick() {
    history.push(`${url}/edit`);
  }
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
              <FontAwesomeIcon icon="user-edit" onClick={handleClick} />
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
              {props.profile.address}
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
