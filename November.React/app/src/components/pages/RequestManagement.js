import React, { useEffect, useState } from "react";
import Request from "../../services/request";
import { CardColumns, Card } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import Moment from "react-moment";
import Game from "../../services/game";
import Requests from "../../services/request";
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";
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

  function cardFooter(request) {
    if (request.send_sent != "0001-01-01T00:00:00Z") {
      return (
        <Card.Footer>
          <small className="text-muted"><Moment fromNow>{request.send_sent}</Moment></small>
        </Card.Footer>
      )
    }
  }
  function getGameState(request) {
    let percent = 0
    let status = ''
    if (request.return_recieved !== "0001-01-01T00:00:00Z") {
      percent = 100
      status = "Game Returned"
    }
    else if (request.return_sent !== "0001-01-01T00:00:00Z") {
      percent = 67
      status = request.user.name + " has sent your game back"
    }
    else if (request.send_recieved !== "0001-01-01T00:00:00Z") {
      percent = 33
      status = request.user.name + " recieved your game."
    }
    else if (request.send_sent !== "0001-01-01T00:00:00Z") {
      percent = 0
      status = "Game sent."
    }
    else {
      percent = 0
      status = request.user.name + " is waiting for you to send this game."
    }
    return { percent: percent, status: status }

  }
  if (state) {
    console.log(state);
    let games = state.requests.map(request => {
      if (
        request.game !== null
      ) {
        let status = getGameState(request)
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
              <Card.Text>
                <ProgressBar
                  filledBackground="linear-gradient(to right, #7abaa9, #00BC8B)"
                  percent={status.percent}
                >
                  <Step transition="scale">
                    {({ accomplished, index }) => (
                      <div
                        className={`transitionStep ${accomplished ? "accomplished" : null}`}
                      >
                        <i className="fa fa-circle" style={{ color: '#00ad7f' }}></i>
                      </div>
                    )}
                  </Step>
                  <Step transition="scale">
                    {({ accomplished, index }) => (
                      <div
                        className={`transitionStep ${accomplished ? "accomplished" : null}`}
                      >
                        <i className="fa fa-circle" style={{ color: '#00ad7f' }}></i>
                      </div>
                    )}
                  </Step>
                  <Step transition="scale">
                    {({ accomplished, index }) => (
                      <div
                        className={`transitionStep ${accomplished ? "accomplished" : null}`}
                      >
                        <i className="fa fa-circle" style={{ color: '#00ad7f' }}></i>
                      </div>
                    )}
                  </Step>
                  <Step transition="scale">
                    {({ accomplished, index }) => (
                      <div
                        className={`transitionStep ${accomplished ? "accomplished" : null}`}
                      >

                        <i className="fa fa-circle" style={{ color: '#00ad7f' }}></i>
                      </div>
                    )}
                  </Step>

                </ProgressBar>
                <br />
                Status: {status.status}
              </Card.Text>
            </Card.Body>
            {cardFooter(request)}
          </Card >
        );
      }
    });

    return <CardColumns>{games}</CardColumns>;
  } else {
    return <div>Loading...</div>;
  }
}

export default RequestManagement;
