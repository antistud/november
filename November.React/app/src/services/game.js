import axios from "axios";
import db from "./db";

const Game = {
  host: db.host,
  auth_headers: db.auth_headers,
  headers: db.headers,
  getGames() {
    return axios.get(this.host + "/Game", { headers: this.auth_headers });
  },
  getFriendsGames() {
    return axios.get(this.host + "/GameFriends", {
      headers: this.auth_headers
    });
  },
  addGame(atlasId) {
    return axios.put(
      this.host + "/Game",
      { atlas_id: atlasId },
      { headers: this.auth_headers }
    );
  },
  getGameDetails(gameId) {
    return axios.get(this.host + "/Game/" + gameId, {
      headers: this.auth_headers
    });
  },
  deleteGame(gameId) {
    return axios.delete(
      this.host + "/Game",
      { _id: gameId },
      {
        headers: this.auth_headers
      }
    );
  }
};

export default Game;
