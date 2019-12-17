
import React, { Component,useEffect ,useState} from "react";
import User from "../../services/user";
import Auth from "../../services/auth";

function Friends() {
  let [friends, setFriends] = useState();
  let [invite, setInvite] = useState();

  useEffect( () => {
    getFriends();
  }, []);

  function getFriends() {
    User.getFriends().then(res => {
      setFriends(res.data);
      console.log("Friends",res.data)
    });
  }
  function inviteHandler(event){
console.log("event",event.target.value)
    setInvite(event.target.value)
  }

  function handleInvite(){
    console.log("event",invite)
    Auth.inviteUser(invite).then(res=>{
console.log(res.data);
setInvite("")
    });
  }

  function handleAccept(friend_id) {
    User.acceptFriend(friend_id).then(res=>{
      console.log("accept",res.data);
      getFriends();
    })
  }

  function friendsList() {

    let list = friends.map((friend)=>(
    <div  key={friend._id}>
      <div className="card" >
        <img className="card-img-top" ></img>
        <div className="card-body">
       <div>{friend.friend.name}</div> 
       <div className="friendLink text-right">
        <div className={friend.accepted ? "":"hidden"}>
       
          <a className="btn btn-link" href={"/?u=" +  friend.friend.username}>
        @{friend.friend.username}
        </a>
        </div> 
        <div className={friend.accepted ? "hidden":""}>
         <button onClick={()=>{handleAccept(friend.friend_id)}} className="btn btn-link">
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

  if(friends){
     return(
    <div>
      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <span className="input-group-text" id="basic-addon1">Invite User:</span>
        </div>
        <input type="text" className="form-control" value={invite} onChange={(event)=>{inviteHandler(event)}}  placeholder="email"></input>
        <div className="input-group-append">
          <span onClick={()=>{handleInvite()}}  className="input-group-text btn btn-success" id="basic-addon2">
           Send
          </span>
        </div>
      </div>
      {friendsList()}
    </div>
  )
  }else{
    return(
      <div>Loading...</div>
    )
  }
  

}

export default Friends;
