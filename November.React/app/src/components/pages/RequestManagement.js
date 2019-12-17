import React, { useEffect, useState } from "react";
import Request from "../../services/request";
import { CardColumns, Card } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import Moment from "react-moment";
import Game from "../../services/game";
import Requests from "../../services/request";
function RequestManagement() {
  let [state, setState] = useState();
  let history = useHistory();
  function onClick(game_id) {
    console.log(game_id);
    history.push("/Game/" + game_id);
  }
  // function getGameDetail(game_id){
  //   return Game.getGameDetails(game_id).then(game => {if(game.dat)})
  // }
  useEffect(() => {
    console.log(state);
    Request.getRequests().then(res => {
      console.log(res);
      if (res.data) {
        setState({ requests: res.data });
      }
    });
  }, []);
  if (state) {
    console.log(state);
    let games = state.requests.map(request => {
      if (
        request.game !== null &&
        request.user.user_id !==
          JSON.parse(localStorage.getItem("profile")).user_id
      ) {
        return (
          <Card
            className="gameDetails"
            onClick={() => onClick(request.game_id)}
          >
            <Card.Img
              className="card-holder-img"
              variant="top"
              // src={request.atlas_image}
              src={request.game.data.image_url}
              className="card-img-top"
            ></Card.Img>
            <Card.Body>
              <Card.Title>
                {request.user.name} requested {request.game.data.name}
              </Card.Title>
              <Card.Text>{request.game_id}</Card.Text>
            </Card.Body>
            <Card.Footer>
              <small className="text-muted">Last updated 3 mins ago</small>
            </Card.Footer>
          </Card>
        );
      }
    });

    return <CardColumns>{games}</CardColumns>;
  } else {
    return <div>Loading...</div>;
  }
}

export default RequestManagement;
