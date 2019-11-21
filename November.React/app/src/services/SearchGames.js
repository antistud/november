import axios from "axios";

function gameSearch(url) {
  return axios.get(url, { headers: { "Content-Type": "application/json" } });
}

export default gameSearch;
