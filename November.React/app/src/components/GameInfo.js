import React, { Component } from "react";
import { Image } from "react-bootstrap";
import "../App.css";
export class GameInfo extends Component {
  getStyle = () => {
    return {
      background: "#ff4f4f4",
      padding: "10px",
      borderBottom: "1px #ccc dotted",
      color: this.props.game.available ? "green" : "red"
    };
  };

  render() {
    const { id, name, images } = this.props.game;
    return (
      <tr>
        <td>
          <Image className="gameImage" src={images.small}></Image>
        </td>
        <td>{name}</td>
      </tr>
    );
  }
}

export default GameInfo;
