import React, { Component } from "react";
import { Table } from "react-bootstrap";

export class Profile extends Component {
  render() {
    return (
      <React.Fragment>
        <h2>{this.props.profile.name}</h2>
        <Table striped bordered>
          <thead>
            <tr>
              <th>Username</th>
              <th>{this.props.profile.username}</th>
            </tr>
            <tr>
              <th>Email</th>
              <th>{this.props.profile.email}</th>
            </tr>
            <tr>
              <th>Address</th>
              <th>
                {this.props.profile.address},{this.props.profile.city},
                {this.props.profile.state}
              </th>
            </tr>
          </thead>

          {/* <tbody>{this.props.renderTableData()}</tbody> */}
        </Table>
      </React.Fragment>
    );
  }
}

export default Profile;
