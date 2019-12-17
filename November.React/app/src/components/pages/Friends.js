import React, { Component, useEffect, useState } from "react";
import User from "../../services/user";
import Auth from "../../services/auth";
import { Typeahead } from "react-bootstrap-typeahead";

function Friends() {
  let [friends, setFriends] = useState();
  let [invite, setInvite] = useState();
  let [users, setUsers] = useState();

  useEffect(() => {
    getFriends();
  }, []);

  function getFriends() {
    User.getFriends().then(res => {
      setFriends(res.data);
      console.log("Friends", res.data);
      getUsers();
    });
  }
  function getUsers() {
    User.getUsers().then(res => {
      let users = [];
      for (let u of res.data) {
        if (u.user_id !== JSON.parse(localStorage.getItem("profile")).user_id) {
          users.push(u);
        }
      }
      setUsers(users);
      console.log("Users", res.data);
    });
  }
  function inviteHandler(value) {
    if (value && value[0]) {
      console.log("value", value[0]);
      setInvite(value[0]);
    }
  }

  function handleInvite() {
    console.log("event", invite);
    if (invite.user_id) {
      console.log("add user", invite.name);
      User.addFriend(invite.user_id).then(res => {
        console.log(res.data);
      });
    } else {
      Auth.inviteUser(invite.name).then(res => {
        console.log(res.data);
        setInvite("");
      });
    }
  }

  function handleAccept(friend_id) {
    User.acceptFriend(friend_id).then(res => {
      console.log("accept", res.data);
      getFriends();
    });
  }

  function friendsList() {
    let list = friends.map(friend => (
      <div key={friend._id}>
        <div className="card">
          <img className="card-img-top"></img>
          <div className="card-body">
            <div>{friend.friend.name}</div>
            <div className="friendLink text-right">
              <div className={friend.accepted ? "" : "hidden"}>
                <a
                  className="btn btn-link"
                  href={"/?u=" + friend.friend.username}
                >
                  @{friend.friend.username}
                </a>
              </div>

              <div className={friend.accepted ? "hidden" : ""}>
                <button
                  onClick={() => {
                    handleAccept(friend.friend_id);
                  }}
                  className="btn btn-link"
                >
                  Accept
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    ));
    return list;
  }

  if (friends && users) {
    return (
      <div>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="basic-addon1">
              Invite User:
            </span>
          </div>
          <Typeahead
            id="typeaheadFriednSearch"
            allowNew
            newSelectionPrefix="Invite With Email: "
            labelKey="name"
            renderMenuItemChildren={(option, props, index) => {
              return "@" + option.username + " - " + option.name;
            }}
            filterBy={["name", "username"]}
            options={users}
            value={invite}
            placeholder="Choose a friend..."
            onChange={event => {
              inviteHandler(event);
            }}
          />
          <div className="input-group-append">
            <span
              onClick={() => {
                handleInvite();
              }}
              className="input-group-text btn btn-success"
              id="basic-addon2"
            >
              Send
            </span>
          </div>
        </div>
        {friendsList()}
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
}

export default Friends;
