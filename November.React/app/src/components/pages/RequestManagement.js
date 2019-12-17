import React, { useEffect, useState } from "react";
import Request from "../../services/request";
import { CardColumns, Card } from "react-bootstrap";
function RequestManagement() {
  let [state, setState] = useState();

  useEffect(() => {
    console.log(state);

    Request.getRequests().then(res => {
      console.log(res);
      setState({ requests: res.data });
    });
  }, []);
  if (state) {
    let games = state.requests.map(request => (
      <Card>
        <Card.Img
          className="card-holder-img"
          variant="top"
          src="holder.js/100px160/"
        ></Card.Img>
        <Card.Body>
          <Card.Title>{request.user_id}</Card.Title>
          <Card.Text>Text about the request</Card.Text>
        </Card.Body>
      </Card>
    ));

    return <CardColumns>{games}</CardColumns>;
  } else {
    return <div>Loading...</div>;
  }
}

export default RequestManagement;
