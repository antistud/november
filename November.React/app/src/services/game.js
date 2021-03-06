import axios from "axios";
import db from "./db";

const Game = {
  host: db.host,
  auth_headers: db.auth_headers,
  headers: db.headers,
  getGames() {
    return axios.get(this.host + "/Game?atlas=true&user=true", {
      headers: this.auth_headers
    });
  },
  getFriendsGames() {
    return axios.get(this.host + "/Game/Friends?atlas=true&user=true", {
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
    return axios.get(
      this.host +
        "/Game/" +
        gameId +
        "?atlas=true&play=true&request=true&user=true",
      {
        headers: this.auth_headers
      }
    );
  },
  setSatus(gameId, status) {
    return axios.post(
      this.host + "/Game",
      { status: status, _id: gameId },
      {
        headers: this.auth_headers
      }
    );
  },
  deleteGame(gameId) {
    return axios.delete(this.host + "/Game", {
      data: { _id: gameId },
      headers: this.auth_headers
    });
  }
};

export default Game;
