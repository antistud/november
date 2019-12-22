import axios from "axios";
import db from "./db";

const Request = {
  host: db.host,
  auth_headers: db.auth_headers,
  headers: db.headers,
  getRequests() {
    return axios.get(this.host + "/Request", { headers: this.auth_headers });
  },
  addRequest(gameId) {
    return axios.put(
      this.host + "/Request",
      { game_id: gameId },
      { headers: this.auth_headers }
    );
  },
  deleteRequest(gameId) {
    return axios.delete(
      this.host + "/Request",
      { _id: gameId },
      {
        headers: this.auth_headers
      }
    );
  },
  markSendAsSent(requestId) {
    return axios.post(
      this.host + "/Request/" + requestId,
      { step: "send_sent" },
      {
        headers: this.auth_headers
      }
    );
  },
  markSendAsRecieved(requestId) {
    return axios.post(
      this.host + "/Request/" + requestId,
      { step: "send_recieved" },
      {
        headers: this.auth_headers
      }
    );
  },
  markReturnAsSent(requestId) {
    return axios.post(
      this.host + "/Request/" + requestId,
      { step: "return_sent" },
      {
        headers: this.auth_headers
      }
    );
  },
  markReturnAsRecieved(requestId) {
    return axios.post(
      this.host + "/Request/" + requestId,
      { step: "return_recieved" },
      {
        headers: this.auth_headers
      }
    );
  },
  requesterRating(requestId, rating) {
    return axios.post(
      this.host + "/Request/" + requestId,
      { requester_rating: rating },
      {
        headers: this.auth_headers
      }
    );
  },
  lenderRating(requestId, rating) {
    return axios.post(
      this.host + "/Request/" + requestId,
      { lender_rating: rating },
      {
        headers: this.auth_headers
      }
    );
  },
  setStatus(requestId, setstatus) {
    return axios.post(
      this.host + "/Request/" + requestId,
      { status: setstatus },
      {
        headers: this.auth_headers
      }
    );
  }
};

export default Request;
