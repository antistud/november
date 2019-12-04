import axios from "axios";

const db = {
  host: "http://november.garishgames.com",
  auth_headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    Authorization: apiKey
  },
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  },
  login(body) {
    return axios.post(this.host + "/auth", body, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  },
  logout(apiKey) {
    return axios.delete(
      this.host + "/auth",

      { headers: { "Content-Type": "application/json", Authorization: apiKey } }
    );
  },
  getGames(apiKey) {
    return axios.get(
      this.host + "/Game",

      { headers: { "Content-Type": "application/json", Authorization: apiKey } }
    );
  },
  getProfile(apiKey) {
    return axios.get(
      this.host + "/auth",

      { headers: { "Content-Type": "application/json", Authorization: apiKey } }
    );
  },
  addGame(apiKey, id) {
    return axios.put(
      this.host + "/Game",
      { atlas_id: id },
      { headers: { "Content-Type": "application/json", Authorization: apiKey } }
    );
  }
};

export default db;
