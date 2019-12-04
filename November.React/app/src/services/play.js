import axios from "axios";
import db from "./db";

const Play = {
  host: db.host,
  auth_headers: db.auth_headers,
  headers: db.headers,
  getPlays() {
    return axios.get(this.host + "/Play", { headers: this.auth_headers });
  },
  createPlay(gameId, story, length, rating) {
    return axios.put(
      this.host + "/play",
      { game_id: gameId, story: story, length: length, rating: rating },
      { headers: this.auth_headers }
    );
  },
  deletePlay(playId) {
    return axios.delete(
      this.host + "/Play",
      { _id: playId },
      {
        headers: this.auth_headers
      }
    );
  }
};

export default Play;
