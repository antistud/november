import React, { useEffect, useState } from "react";
import Request from "../../services/request";
import { CardColumns, Card } from "react-bootstrap";
import { useHistory } from "react-router-dom"
import Game from "../../services/game"
function RequestManagement() {
  let [state, setState] = useState({ requests: [] });
  let history = useHistory()
  function onClick(game_id) {
    console.log(game_id)
    history.push('/Game/' + game_id)
  }
  useEffect(() => {

    console.log(state);
    Request.getRequests().then(res => {
      console.log(res);
      let resdata = res.data.map(req => (
        Game.getGameDetails(req.game_id).then(res => { if (res.data.atlas) { console.log(res); req.atlas_image = res.data.atlas.images.medium; } })
      ))
      setState({ requests: resdata })
    });
  }, []);
  if (state) {
    console.log(state)
    let games = state.requests.map(request => (
      <Card onClick={() => onClick(request.game_id)}>
        <Card.Img
          className="card-holder-img"
          variant="top"
          // src={request.atlas_image}
          src='holderjs'
        ></Card.Img>
        <Card.Body>
          <Card.Title>{request.user_id}</Card.Title>
          <Card.Text>{request.game_id}</Card.Text>
        </Card.Body>
      </Card>
    ));

    return <CardColumns>{games}</CardColumns>;
  } else {
    return <div>Loading...</div>;
  }
}

export default RequestManagement;
