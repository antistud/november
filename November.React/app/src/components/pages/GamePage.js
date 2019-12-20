import React, { Component, useEffect, useState } from "react";
import * as moment from "moment";
import { useHistory, useRouteMatch, useParams } from "react-router-dom";
import Game from "../../services/game";
import Request from "../../services/request";

function GamePage(props) {
  let history = useHistory();
  let [game, setGame] = useState();
  let { gameId } = useParams();
  let { url } = useRouteMatch();
  useEffect(() => {
    getGame();
  }, []);

  function getGame() {
    Game.getGameDetails(gameId).then(res => {
      setGame(res.data);
    });
  }

  function markStep(step, requestId) {
    if (step == "rr") {
      Request.markReturnAsRecieved(requestId).then(res => {
        console.log("rr", res);
        getGame();
      });
    } else if (step == "rs") {
      Request.markReturnAsSent(requestId).then(res => {
        console.log("rs", res);
        getGame();
      });
    } else if (step == "sr") {
      Request.markSendAsRecieved(requestId).then(res => {
        console.log("sr", res);
        getGame();
      });
    } else if (step == "ss") {
      Request.markSendAsSent(requestId).then(res => {
        console.log("ss", res);
        getGame();
      });
    }
  }

  function GameRequestItem(r) {
    console.log("console", r);
    let rr = <i className="far fa-circle"></i>;
    let rs = <i className="far fa-circle"></i>;
    let sr = <i className="far fa-circle"></i>;
    let ss = <i className="far fa-circle"></i>;
    let button = "";
    if (r.item.return_recieved !== "0001-01-01T00:00:00Z") {
      rr = (
        <i
          className="fa fa-circle"
          data-toggle="tooltip"
          data-placement="top"
          title={
            "Recieved: " + moment(r.item.return_recieved, "YYYYMMDD").fromNow()
          }
        ></i>
      );
    } else if (
      game.user_id === JSON.parse(localStorage.getItem("profile")).user_id &&
      r.item.return_sent !== "0001-01-01T00:00:00Z"
    ) {
      button = (
        <button
          className="btn btn-block btn-success"
          onClick={() => markStep("rr", r.item._id)}
        >
          Recieved Back
        </button>
      );
    }

    if (r.item.return_sent !== "0001-01-01T00:00:00Z") {
      rs = (
        <i
          className="fa fa-circle"
          data-toggle="tooltip"
          data-placement="top"
          title={"Sent: " + moment(r.item.return_sent, "YYYYMMDD").fromNow()}
        ></i>
      );
    } else if (
      r.item.user_id === JSON.parse(localStorage.getItem("profile")).user_id &&
      r.item.send_recieved !== "0001-01-01T00:00:00Z"
    ) {
      button = (
        <button
          className="btn btn-block btn-success"
          onClick={() => markStep("rs", r.item._id)}
        >
          Send Back
        </button>
      );
    }

    if (r.item.send_recieved !== "0001-01-01T00:00:00Z") {
      sr = (
        <i
          className="fa fa-circle"
          data-toggle="tooltip"
          data-placement="top"
          title={
            "Recieved: " + moment(r.item.send_recieved, "YYYYMMDD").fromNow()
          }
        ></i>
      );
    } else if (
      r.item.user_id === JSON.parse(localStorage.getItem("profile")).user_id &&
      r.item.send_sent !== "0001-01-01T00:00:00Z"
    ) {
      button = (
        <button
          className="btn btn-block btn-success"
          onClick={() => markStep("sr", r.item._id)}
        >
          Recieved Game
        </button>
      );
    }

    if (r.item.send_sent !== "0001-01-01T00:00:00Z") {
      ss = (
        <i
          className="fa fa-circle"
          data-toggle="tooltip"
          data-placement="top"
          title={"Sent: " + moment(r.item.send_sent, "YYYYMMDD").fromNow()}
        ></i>
      );
    } else if (
      JSON.parse(localStorage.getItem("profile")).user_id === game.user_id
    ) {
      button = (
        <button
          className="btn btn-block btn-success"
          onClick={() => markStep("ss", r.item._id)}
        >
          Send Out
        </button>
      );
    }
    if (r.item.user_name) {
      return (
        <div className="item">
          <div className="row">
            <div className="col-sm-7">
              <div className="">
                {r.item.user_name}
                <div>
                  Send:&nbsp;
                  {ss}
                  <i className="fa fa-minus"></i>
                  {sr}
                </div>
                <div>
                  Return:&nbsp;
                  {rs}
                  <i className="fa fa-minus"></i>
                  {rr}
                </div>
              </div>
            </div>
            <div className="col-sm-5">{button}</div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  function GamePlayItem(p) {
    return <div>Play: {p.user_name}</div>;
  }
  function handleNewRequestClick() {
    Request.addRequest(gameId).then(res => {
      console.log("request return", res.data);
      getGame();
    });
  }

  function deleteGame(gameId) {
    console.log(gameId);

    Game.deleteGame(gameId).then(res => {
      console.log("delete game", res.data);
      // window.location.replace("/");
      history.push("/");
    });
  }

  function RequestButton() {
    if (game.user_id !== JSON.parse(localStorage.getItem("profile")).user_id) {
      return (
        <div className="col-sm">
          <a
            href="#"
            className="btn btn-block btn-primary mt-2"
            onClick={() => handleNewRequestClick()}
          >
            <i className="fa fa-share-square"></i>
            <br /> Request This Game
          </a>
        </div>
      );
    } else {
      return (
        <div className="col-sm">
          <button
            onClick={() => deleteGame(game._id)}
            className="btn btn-block btn-danger mt-2"
          >
            <i className="fa fa-trash"></i>
            <br />
            Remove Game
          </button>
        </div>
      );
    }
  }

  if (game && game.atlas) {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-7">
            <div className="card gameDetails">
              <img src={game.atlas.image_url} className="card-img-top"></img>
              <div className="card-body">
                <h5 className="card-title">{game.atlas.name}</h5>
                <p className="card-text">
                  Publisher: {game.atlas.primary_publisher}
                </p>
              </div>
              <div className="card-footer text-right">More Details</div>
            </div>
          </div>
          <div className="col-sm-5">
            <div className="row">
              {/*
               <div className="col-sm">
                <a href="#" className="btn btn-block btn-primary mt-2">
                  <i className="fa fa-dice"></i>
                  <br />
                  Record Play
                </a>
              </div> 
              */}

              <RequestButton></RequestButton>
            </div>

            <div className="card ">
              <div className="card-header">Requests</div>
              <div className="card-body">
                {game.request.map(item => (
                  <GameRequestItem item={item} key={item._id} />
                ))}
              </div>
            </div>
            {/* 
            <div className="card">
              <div className="card-header">Open Requests</div>
              {game.play.map(item => (
                <GamePlayItem item={item} key={item._id} />
              ))}
              <div className="card-footer text-right"></div>
            </div> 
            */}
          </div>
        </div>
      </div>
    );
  } else {
    return <div className="loading">Loading...</div>;
  }
}

export default GamePage;
