import React, { useEffect, useState } from "react";
import Request from "../../services/request";
import { CardColumns, Card, Col } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import Moment from "react-moment";
import Game from "../../services/game";
import _ from "lodash";
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";

function RequestManagement() {
  let [state, setState] = useState();
  let [profile, setProfile] = useState(
    JSON.parse(localStorage.getItem("profile"))
  );
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
      setProfile(JSON.parse(localStorage.getItem("profile")));
      console.log(res);
      if (res.data) {
        setState({
          requests: _.orderBy(
            _.filter(res.data, x => {
              return (
                (x.status === 0 || x.status == 1) &&
                x.return_recieved === "0001-01-01T00:00:00Z"
              );
            }),
            "_id",
            "desc"
          )
        });
      }
    });
    console.log(profile);
  }, []);
  function reloadRequests() {
    Request.getRequests().then(res => {
      console.log(res);
      if (res.data) {
        setState({
          requests: _.filter(res.data, x => {
            return (
              (x.status === 0 || x.status == 1) &&
              x.return_recieved === "0001-01-01T00:00:00Z"
            );
          })
        });
      }
    });
  }
  function markStep(step, requestId) {
    if (step == "rr") {
      Request.markReturnAsRecieved(requestId).then(res => {
        console.log("rr", res);
        reloadRequests();
      });
    } else if (step == "rs") {
      Request.markReturnAsSent(requestId).then(res => {
        console.log("rs", res);
        reloadRequests();
      });
    } else if (step == "sr") {
      Request.markSendAsRecieved(requestId).then(res => {
        console.log("sr", res);
        reloadRequests();
      });
    } else if (step == "ss") {
      Request.markSendAsSent(requestId).then(res => {
        console.log("ss", res);
        reloadRequests();
      });
    }
  }

  function setStatus(requestId, status) {
    Request.setStatus(requestId, status).then(res => {
      console.log(res.data);
      reloadRequests();
    });
  }
  function cardFooter(request, status) {
    return (
      <div className="requestFooter">
        <div className="d-flex justify-content-between">
          <small className="text-muted">
            <Moment fromNow>
              {
                new Date(
                  parseInt(request._id.toString().substring(0, 8), 16) * 1000
                )
              }
            </Moment>
          </small>
          <small>
            <a onClick={() => onClick(request.game_id)}>More Info...</a>
          </small>
        </div>
      </div>
    );
  }
  function getGameState(request) {
    const incoming = request.user_id !== profile.user_id;
    let percent = 0;
    let status = "";
    let button = null;
    if (request.status == "0" && incoming) {
      status = "Waiting for you to accept";
      button = (
        <div>
          <button
            className="btn btn-block btn-success"
            onClick={() => setStatus(request._id, 1)}
          >
            Accept
          </button>
          <button
            className="btn btn-block btn-success"
            onClick={() => setStatus(request._id, 2)}
          >
            Decline
          </button>
        </div>
      );
    } else if (request.status == "0" && !incoming) {
      status = "Your request has been submitted";
      button = (
        <button
          className="btn btn-block btn-success"
          onClick={() => setStatus(request._id, 3)}
        >
          Cancel
        </button>
      );
    } else if (request.return_recieved !== "0001-01-01T00:00:00Z") {
      percent = 100;
      status = "Game Returned";
    } else if (request.return_sent !== "0001-01-01T00:00:00Z") {
      percent = 67;
      if (incoming) {
        status = request.user.name + " has sent your game back";
        button = (
          <button
            className="btn btn-block btn-success"
            onClick={() => markStep("rr", request._id)}
          >
            Recieved Back
          </button>
        );
      } else {
        status = "You sent the game back";
      }
    } else if (request.send_recieved !== "0001-01-01T00:00:00Z") {
      percent = 34;
      if (incoming) {
        status = request.user.name + " recieved your game.";
      } else {
        status = "You have the game";
        button = (
          <button
            className="btn btn-block btn-success"
            onClick={() => markStep("rs", request._id)}
          >
            Return Game
          </button>
        );
      }
    } else if (request.send_sent !== "0001-01-01T00:00:00Z") {
      percent = 0;
      if (incoming) {
        status = "Game sent.";
      } else {
        status = "On its way!";
        button = (
          <button
            className="btn btn-block btn-success"
            onClick={() => markStep("sr", request._id)}
          >
            Mark Received
          </button>
        );
      }
    } else if (request.user_id !== profile.user_id) {
      percent = 0;
      status = request.user.name + " is waiting for you to send this game.";
      button = (
        <button
          className="btn btn-block btn-success"
          onClick={() => markStep("ss", request._id)}
        >
          Mark Sent
        </button>
      );
    } else if (request.user_id == profile.user_id) {
      percent = 0;
      status = "You are waiting for this game";
    }
    return { percent: percent, status: status, button: button };
  }
  if (state) {
    console.log(state);
    let games = state.requests.map(request => {
      if (request.game !== null) {
        let status = getGameState(request);

        return (
          <Card className="requestGameDetails">
            <Card.Img
              className="card-holder-img"
              variant="top"
              src={request.game.data.image_url}
              className="card-img-top"
            ></Card.Img>
            <Card.Body>
              <Card.Title>
                {profile.user_id !== request.user.user_id
                  ? `${request.user.name}`
                  : "You"}{" "}
                requested {request.game.data.name}
              </Card.Title>
              <Card.Text>
                <ProgressBar
                  filledBackground="linear-gradient(to right, #7abaa9, #00BC8B)"
                  percent={status.percent}
                >
                  <Step transition="scale">
                    {({ accomplished, index }) => (
                      <div
                        className={`transitionStep ${
                          accomplished ? "accomplished" : null
                        }`}
                      >
                        <i
                          className="fa fa-circle"
                          style={{ color: "#00ad7f" }}
                        ></i>
                      </div>
                    )}
                  </Step>
                  <Step transition="scale">
                    {({ accomplished, index }) => (
                      <div
                        className={`transitionStep ${
                          accomplished ? "accomplished" : null
                        }`}
                      >
                        <i
                          className="fa fa-circle"
                          style={{ color: "#00ad7f" }}
                        ></i>
                      </div>
                    )}
                  </Step>
                  <Step transition="scale">
                    {({ accomplished, index }) => (
                      <div
                        className={`transitionStep ${
                          accomplished ? "accomplished" : null
                        }`}
                      >
                        <i
                          className="fa fa-circle"
                          style={{ color: "#00ad7f" }}
                        ></i>
                      </div>
                    )}
                  </Step>
                  <Step transition="scale">
                    {({ accomplished, index }) => (
                      <div
                        className={`transitionStep ${
                          accomplished ? "accomplished" : null
                        }`}
                      >
                        <i
                          className="fa fa-circle"
                          style={{ color: "#00ad7f" }}
                        ></i>
                      </div>
                    )}
                  </Step>
                </ProgressBar>
                <br />
                <span>
                  Status: {status.status} {status.button}
                </span>
              </Card.Text>
              {cardFooter(request, status)}
            </Card.Body>
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
