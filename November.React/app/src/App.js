import React, { Component } from "react";
import GameLibrary from "./components/GameLibrary";
import "./App.css";
import gameSearch from "./services/SearchGames";
import AppNavbar from "./components/AppNavbar";
import GameSearchBox from "./components/GameSearchBox";
import { Container } from "react-bootstrap";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apptitle: "BoxShare",
      games: []
    };
  }

  //toggle game availability
  markAvailable = id => {
    this.setState({
      games: this.state.games.map(game => {
        if (game.id === id) {
          game.available = !game.available;
        }
        return game;
      })
    });
  };

  gameSearch = searchstring => {
    gameSearch(
      "https://www.boardgameatlas.com/api/search?name=" +
        searchstring +
        "&limit=10&client_id=PaLV4upJP7"
    ).then(response => {
      console.log(response.data.games);
      this.setState({
        games: response.data.games
      });
      return response.data.games;
    });

    console.log(this.state.games);
  };

  render() {
    return (
      <div className="App">
        <AppNavbar apptitle={this.state.apptitle}></AppNavbar>
        <Container className="p-3">
          <GameSearchBox gameSearch={this.gameSearch} />
          <br />
          <GameLibrary
            games={this.state.games}
            markAvailable={this.markAvailable}
          />
        </Container>
      </div>
    );
  }
}

export default App;
