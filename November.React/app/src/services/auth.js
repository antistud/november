import axios from "axios";
import db from "./db";

const Auth = {
  host: db.host,
  auth_headers: db.auth_headers,
  headers: db.headers,
  getProfile() {
    return axios.get(this.host + "/Auth", { headers: this.auth_headers });
  },
  inviteUser(email) {
    return axios.put(
      this.host + "/Auth",
      { email: email },
      { headers: this.auth_headers }
    );
  }
};

export default Auth;
