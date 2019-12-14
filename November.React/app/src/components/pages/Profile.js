import React, { Component, useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory, useRouteMatch } from "react-router-dom";
import User from "../../services/user"
function Profile(props) {
  let [profile, setProfile] = useState();

  useEffect(() => {
    console.log(profile)

    User.getProfile().then(res => { console.log(res); setProfile(res.data) })

    console.log('useEffect invoked');

  }, []);
  let history = useHistory();
  let { url } = useRouteMatch();
  function handleClick() {
    history.push(`${url}/edit`);
  }
  if (profile) {

    return (
      <React.Fragment>
        <div>
          <h2>
            <span>
              <FontAwesomeIcon icon="user-circle" />
              {profile.name}
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
              <th>{profile.username}</th>
            </tr>
            <tr>
              <th>Email</th>
              <th>{profile.email}</th>
            </tr>
            <tr>
              <th>Address</th>
              <th>
                {profile.address}
              </th>
            </tr>
            <tr>
              <th>City</th>
              <th>{profile.city}</th>
            </tr>
            <tr>
              <th>State</th>
              <th>{profile.state}</th>
            </tr>
          </thead>

          {/* <tbody>{this.props.renderTableData()}</tbody> */}
        </Table>
      </React.Fragment>
    );
  }
  else {
    return (
      <div>Loading...</div>
    )
  }

}

export default Profile;
