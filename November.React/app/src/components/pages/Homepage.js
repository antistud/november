import React, { Component } from "react";
import GameLibrary from "../GameLibrary";
import searchGames from "../../services/SearchGames"
export class Homepage extends Component {
  componentDidUpdate() { console.log('componentdidupdate') }
  state = { gamelibrary: [] }
  render() {
    console.log('render props: ', this.props)
    // const ids = this.props.gamelibrary.map(game => {
    //   return game.atlas_id;
    // }).toString();
    // if (ids) {
    //   searchGames(
    //     "https://www.boardgameatlas.com/api/search?ids=" +
    //     ids +
    //     "&client_id=PaLV4upJP7"
    //   ).then(gameData => {
    //     console.log("game data");
    //     this.setState({ gamelibrary: gameData.data.games });
    //   });
    // };
    return (
      <React.Fragment>
        <GameLibrary
          username={this.props.username}
          gamelibrary={this.state.gamelibrary}
        />
      </React.Fragment>
    );
  }
}

export default Homepage;
