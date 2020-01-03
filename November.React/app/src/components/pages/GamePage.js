import React, { Component, useEffect, useState } from "react";
import * as moment from "moment";
import { useHistory, useRouteMatch, useParams } from "react-router-dom";
import Game from "../../services/game";
import GameRequestItem from "../GameRequestItem";
import GameButtons from "../GameButtons";
import Request from "../../services/request";
import BootstrapSwitchButton from "bootstrap-switch-button-react";

function GamePage(props) {
  let history = useHistory();
  let [game, setGame] = useState();
  let [imageactive, setImageactive] = useState();
  let [showrequest, setShowRequest] = useState();
  let { gameId } = useParams();
  let { url } = useRouteMatch();
  useEffect(() => {
    getGame();
  }, []);

  function getGame() {
    Game.getGameDetails(gameId).then(res => {
      setGame(res.data);
      console.log("game", res.data);
    });
  }

  function visibleSwitch() {
    if (game.user_id == JSON.parse(localStorage.getItem("profile")).user_id) {
      if (game.status == 1 || game.status == 0) {
        return (
          <BootstrapSwitchButton
            checked={true}
            onlabel="Visible"
            offlabel="Hidden"
            onChange={checked => {
              if (checked == true) {
                Game.setSatus(game._id, 1);
              } else {
                Game.setSatus(game._id, 2);
              }
            }}
            size="sm"
            width={100}
          />
        );
      } else {
        return (
          <BootstrapSwitchButton
            checked={false}
            onlabel="Visible"
            offlabel="Hidden"
            onChange={checked => {
              if (checked == true) {
                Game.setSatus(game._id, 1);
              } else {
                Game.setSatus(game._id, 2);
              }
            }}
            size="sm"
            width={100}
          />
        );
      }
    } else {
      return null;
    }
  }

  function GamePlayItem(p) {
    return <div>Play: {p.user_name}</div>;
  }
  function handleNewRequestClick() {
    setShowRequest(false);
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

  function toggleImageClass() {
    setImageactive(!imageactive);
  }

  if (game && game.atlas) {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-7">
            <div className="card gameDetails">
              <div
                className={imageactive ? "active card-img-top" : "card-img-top"}
                onClick={toggleImageClass}
              >
                <img src={game.atlas.image_url}></img>
              </div>
              <div className="card-body">
                <div className="card-title d-flex align-items-center">
                  <h4 className="mr-auto p-3"> {game.atlas.name}</h4>
                  {visibleSwitch()}
                </div>
                <div className="card-text">
                  {imageactive}
                  <b>
                    {" "}
                    <a href={"/?u=" + game.user.username}>
                      @{game.user.username}
                    </a>
                  </b>{" "}
                  - {game.user.name}
                  <br />
                  <br />
                  <b>Publisher:</b> {game.atlas.primary_publisher}
                  <br />
                  <b>Published:</b> {game.atlas.year_published}
                  <br />
                  <b>Players:</b> {game.atlas.min_players} -{" "}
                  {game.atlas.max_players}
                  <br />
                  <b>Play Time:</b> {game.atlas.min_playtime} -{" "}
                  {game.atlas.max_playtime}
                  <br />
                  <b>Ages:</b> {game.atlas.min_age}
                  <br />
                  <br />
                  <br />
                  <div
                    dangerouslySetInnerHTML={{ __html: game.atlas.description }}
                  ></div>
                </div>
              </div>
              <div className="card-footer text-right">
                <a
                  className="btn btn-link"
                  href={game.atlas.official_url}
                  target="_blank"
                >
                  Official Link
                </a>
                <a
                  className="btn btn-link"
                  href={game.atlas.rules_url}
                  target="_blank"
                >
                  Rules
                </a>
              </div>
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

              <GameButtons
                game={game}
                showrequest={showrequest}
                handleNewRequestClick={handleNewRequestClick}
                deleteGame={deleteGame}
              />
            </div>

            <div className="card ">
              <div className="card-header">Requests</div>
              <div className="card-body">
                {game.request.map(item => (
                  <GameRequestItem
                    item={item}
                    key={item._id}
                    game={game}
                    getGame={getGame}
                  />
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
