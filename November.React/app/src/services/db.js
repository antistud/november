import axios from "axios";

const db = {
  host: "http://november.garishgames.com",
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
      { Authorization: "Bearer" + apiKey },
      { headers: { "Content-Type": "application/json" } }
    );
  },
  getGames(apiKey) {
    return axios.get(
      this.host + "/Game",
      { Authorization: "Bearer" + apiKey },
      { headers: { "Content-Type": "application/json" } }
    );
  },
  getProfile(apiKey) {
    return axios.get(
      this.host + "/auth",
      { Authorization: "Bearer" + apiKey },
      { headers: { "Content-Type": "application/json" } }
    );
  }
};

export default db;
