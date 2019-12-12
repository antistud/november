import React, { Component } from "react";
import { Image } from "react-bootstrap";

import "../App.css";

import Game from "../services/game";
export class GameInfo extends Component {
  //Colors "add" icon based on whether or not it exists in library
  getIconStyle = gameId => {
    if (this.getLibraryIds().includes(gameId)) {
      return { color: "#848484" };
    } else {
      return { color: "#000000" };
    }
  };
  getLibraryIds = () => {
    if (this.props.gamelibrary != null) {
      return this.props.gamelibrary.map(id => id.atlas_id);
    } else {
      return [];
    }
  };

  saveGameCheck = gameId => {
    console.log("savegame executed");
    if (!this.getLibraryIds().includes(gameId)) {
      Game.addGame(gameId)
        .then(res => {
          this.props.updategamelibrary();
          if (res.status != 200) {
            alert("There was an error saving the game");
          }
        })
        .catch(error => {
          alert(error);
        });
    } else {
      return;
    }
  };
  render() {
    const { id, name, images } = this.props.game;

    return (
      <tr>
        <td>
          <Image className="gameImage" src={images.small}></Image>
        </td>
        <td>{name}</td>
        <td>
          <i
            style={this.getIconStyle(id)}
            className="fas fa-folder-plus fa-fw fa-3x"
            onClick={() => {
              this.saveGameCheck(id);
            }}
          ></i>
        </td>
      </tr>
    );
  }
}

export default GameInfo;
