const db = {
  host: "http://november.garishgames.com",
  auth_headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    Authorization: localStorage.getItem("apiKey")
  },
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  }
};

export default db;
