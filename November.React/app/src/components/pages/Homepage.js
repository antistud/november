import React, { Component } from "react";
import GameLibrary from "../GameLibrary";

export class Homepage extends Component {
  render() {
    return (
      <React.Fragment>
        <GameLibrary gamelibrary_atlas={this.props.gamelibrary_atlas} />
      </React.Fragment>
    );
  }
}

export default Homepage;
