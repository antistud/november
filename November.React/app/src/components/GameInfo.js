import React, { Component, useEffect, useState } from "react";
import { Image } from "react-bootstrap";
import _ from "lodash";

import "../App.css";

import Game from "../services/game";
function GameInfo(props) {
  const [hidebutton, setHidebutton] = useState();
  useEffect(() => {}, []);

  //Colors "add" icon based on whether or not it exists in library
  function getIcon(gameId) {
    if (!getLibraryIds()[gameId] && hidebutton != gameId) {
      return (
        <i
          className="fas fa-folder-plus fa-fw fa-3x"
          onClick={() => {
            saveGameCheck(gameId);
          }}
        ></i>
      );
    } else if (hidebutton != gameId) {
      return <div>Added</div>;
    }
  }
  function getLibraryIds() {
    if (props.gamelibrary !== null) {
      return _.mapKeys(
        _.filter(props.gamelibrary, g => {
          return (
            g.user_id == JSON.parse(localStorage.getItem("profile")).user_id
          );
        }),
        "atlas_id"
      );
    } else {
      return [];
    }
  }

  function saveGameCheck(gameId) {
    setHidebutton(gameId);
    Game.addGame(gameId)
      .then(res => {
        props.updategamelibrary();
        if (res.status !== 200) {
          alert("There was an error saving the game");
        }
      })
      .catch(error => {
        alert(error);
      });
  }
  const { id, name, images } = props.game;

  return (
    <tr>
      <td>
        <Image className="gameImage" src={images.small}></Image>
      </td>
      <td>{name}</td>
      <td>{getIcon(id)}</td>
    </tr>
  );
}

export default GameInfo;
