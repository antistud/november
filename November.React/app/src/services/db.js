import axios from "axios";

const db = {
    login(url, body) {
        return axios.post(url, body, { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
    }, logout(url, apiKey) {
        return axios.delete(url, { Authorization: apiKey }, { headers: { "Content-Type": "application/json" } });
    }, getGames(url, apiKey) {
        return axios.get(url, { Authorization: apiKey }, { headers: { "Content-Type": "application/json" } })
    }
}





export default db