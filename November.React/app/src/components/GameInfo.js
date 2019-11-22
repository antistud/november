import React, { Component } from "react";
import { Image } from "react-bootstrap";
import "../App.css";
export class GameInfo extends Component {
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
            className="fas fa-folder-plus fa-fw fa-3x"
            onClick={this.props.saveGame.bind(this, this.props.game)}
          ></i>
        </td>
      </tr>
    );
  }
}

export default GameInfo;
