import React, { Component } from "react";
import GameLibrary from "../GameLibrary";
export class Homepage extends Component {
  render() {
    return (
      <React.Fragment>
        <GameLibrary
          username={this.props.username}
          gamelibrary={this.props.gamelibrary}
        />
      </React.Fragment>
    );
  }
}

export default Homepage;
