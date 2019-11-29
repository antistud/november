import axios from "axios";

function searchGames(url) {
  return axios.get(url, { headers: { "Content-Type": "application/json" } });
}

export default searchGames;
