import React, { Component } from "react";
import GameLibrary from "../GameLibrary";
export class Homepage extends Component {
  render() {
    return (
      <React.Fragment>
        <GameLibrary gamelibrary={this.props.gamelibrary} />
      </React.Fragment>
    );
  }
}

export default Homepage;
