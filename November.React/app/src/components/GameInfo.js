import React, { Component, useEffect } from "react";
import { Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../App.css";
import { isTemplateElement } from "@babel/types";
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
      return this.props.gamelibrary.map(id => id.id);
    } else {
      return [];
    }
  };

  saveGameCheck = gameId => {
    if (!this.getLibraryIds().includes(gameId)) {
      return this.props.saveGame.bind(this, this.props.game);
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
            onClick={this.saveGameCheck(id)}
          ></i>
        </td>
      </tr>
    );
  }
}

export default GameInfo;
