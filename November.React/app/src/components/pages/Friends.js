import React, { Component, useEffect, useState } from "react";
import User from "../../services/user";
import Auth from "../../services/auth";
import { Typeahead } from "react-bootstrap-typeahead";
import _ from "lodash";

function Friends() {
  let [friends, setFriends] = useState();
  let [inviteUser, setInvite] = useState();
  let [users, setUsers] = useState();
  let [typeahead, setTypeahead] = useState();

  useEffect(() => {
    getFriends();
  }, []);

  function getFriends() {
    if (localStorage.getItem("friends")) {
      setFriends(JSON.parse(localStorage.getItem("friends")));
    }
    User.getFriends().then(res => {
      setFriends(res.data);
      console.log("Friends", res.data);
      localStorage.setItem("friends", JSON.stringify(res.data));
      getUsers();
    });
  }
  function getUsers() {
    // if (localStorage.getItem("otherUsers")) {
    //   setFriends(JSON.parse(localStorage.getItem("otherUsers")));
    // }
    User.getUsers().then(res => {
      let users = [];
      for (let u of res.data) {
        if (u.user_id !== JSON.parse(localStorage.getItem("profile")).user_id) {
          users.push(u);
        }
      }
      // localStorage.setItem(
      //   "otherUsers",
      //   JSON.stringify(_.filter(users, "name"))
      // );
      setUsers(_.filter(users, "name"));
      console.log("Users", res.data);
    });
  }
  // function inviteHandler(value) {
  //   if (value && value[0]) {
  //     console.log("value", value[0]);
  //     setInvite(value[0]);
  //   }
  // }

  function handleInvite() {
    //let invite = typeahead.getInstance().getInput();
    console.log("event", inviteUser[0]);
    typeahead.getInstance().clear();
    if (inviteUser[0]) {
      if (inviteUser[0].user_id) {
        console.log("add user", inviteUser[0].name);
        User.addFriend(inviteUser[0].user_id).then(res => {
          console.log(res.data);
          //setInvite("");
          getFriends();
        });
      } else {
        Auth.inviteUser(inviteUser[0].name).then(res => {
          console.log(res.data);
          // setInvite("");
          getFriends();
        });
      }
    }
  }

  function handleAccept(friend_id) {
    User.acceptFriend(friend_id).then(res => {
      console.log("accept", res.data);
      getFriends();
    });
  }

  function friendListCard(friend) {
    let send = "";
    if (
      friend.user_id === JSON.parse(localStorage.getItem("profile")).user_id
    ) {
      send = (
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
      );
    } else {
      send = (
        <div key={friend._id}>
          <div className="card">
            <img className="card-img-top"></img>
            <div className="card-body">
              <div>
                {friend.user.name
                  ? friend.user.name
                  : "Invited User - " + friend.user.username}
              </div>
              <div className="friendLink text-right">
                <div className={friend.accepted ? "" : "hidden"}>
                  <a
                    className="btn btn-link"
                    href={"/?u=" + friend.user.username}
                  >
                    @{friend.user.username}
                  </a>
                </div>
                <div className={friend.accepted ? "hidden" : ""}>Pending</div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return send;
  }

  function friendsList() {
    let list = friends.map(friend => <div>{friendListCard(friend)}</div>);
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
            ref={ref => setTypeahead(ref)}
            id="typeaheadFriednSearch"
            allowNew
            newSelectionPrefix="Invite With Email: "
            labelKey="name"
            renderMenuItemChildren={(option, props, index) => {
              return "@" + option.username + " - " + option.name;
            }}
            filterBy={["name", "username"]}
            options={users}
            placeholder="Choose a friend..."
            onChange={o => {
              setInvite(o);
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
        <div className="row">
          <div className=" col-sm-12">
            <h2>
              Friends
              <button
                onClick={() => {
                  getFriends();
                }}
                className="btn btn-link"
              >
                <i class="fas fa-sync"></i>
              </button>
            </h2>
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
