import axios from "axios";
import db from "./db";

const User = {
  host: db.host,
  auth_headers: db.auth_headers,
  headers: db.headers,
  getProfile() {
    return axios.get(this.host + "/User", { headers: this.auth_headers });
  },
  getFriends() {
    return axios.get(this.host + "/User/Friends", {
      headers: this.auth_headers
    });
  },
  addFriend(friendId) {
    return axios.put(this.host + "/User/Friend/" + friendId, "", {
      headers: this.auth_headers
    });
  },
  acceptFriend(friendId) {
    return axios.post(this.host + "/User/Friend/" + friendId, {accepted:true}, {
      headers: this.auth_headers
    });
  },
  updateProfile(body) {
    return axios.post(
      this.host + "/User",
      body,
      { headers: this.auth_headers }
    );
  },
  getUsers() {
    return axios.get(this.host + "/User/all", { headers: this.auth_headers });
  }
};

export default User;
