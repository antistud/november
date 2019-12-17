
import React, { Component,useEffect ,useState} from "react";
import User from "../../services/user";

function Friends() {
  let [friends, setFriends] = useState();

  useEffect(async () => {
    getFriends();
  }, []);

  function getFriends() {
    User.getFriends().then(res => {
      setFriends(res.data);
      console.log("Friends",res.data)
    });
  }
  return(
    <div>Hello Friends</div>
  ) 

}

export default Friends;
