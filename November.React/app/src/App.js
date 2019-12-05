import React, { Component } from "react";
import { Container } from "react-bootstrap";
import "./App.css";

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom";

import searchGames from "./services/SearchGames";
import db from "./services/db";
import Game from "./services/game";
import AppNavbar from "./components/AppNavbar";
import GameSearchBox from "./components/GameSearchBox";
import GameSearch from "./components/GameSearch";
import About from "./components/pages/About";
import Homepage from "./components/pages/Homepage";
import Login from "./components/pages/Login";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apptitle: "BoxShare",
      games: [],
      gamelibrary: [],
      gamelibrary_atlas: [],
      apiKey: null,
      loggedIn: false
    };
  }

  componentDidMount() {
    console.log("component did mount appjs");
    this.getProfile();

    if (localStorage.getItem("apiKey") !== null) {
      this.getGameLibrary();
    }
  }


  componentDidUpdate() {
    if (this.state.apiKey === null && localStorage.getItem("apiKey") !== null) {
      this.setState({ apiKey: localStorage.getItem("apiKey") });

  componentDidMount() {
    if (localStorage.getItem("apiKey") !== null) {
      Game.getGames().then(data => {
        console.log("games", data);
      });
      db.getGames(localStorage.getItem("apiKey")).then(response => {
        const ids = response.data
          .map(game => {
            return game.atlas_id;
          })
          .toString();
        searchGames(
          "https://www.boardgameatlas.com/api/search?ids=" +
            ids +
            "&client_id=PaLV4upJP7"
        ).then(gameData => {
          this.setState({ gamelibrary: gameData.data.games });
        });
      });

    }
  }

  getProfile() {
    db.getProfile(localStorage.getItem("apiKey"))
      .then(profile => {
        localStorage.setItem("profile", JSON.stringify(profile.data));
        // console.log(profile);
      })
      .catch(error => {
        alert(error);
      });
  }
  getAtlasInfo = () => {
    const ids = this.state.gamelibrary
      .map(game => {
        return game.atlas_id;
      })
      .toString();

    console.log("getAtlasInfo called: ", ids);
    if (ids) {
      searchGames(
        "https://www.boardgameatlas.com/api/search?ids=" +
          ids +
          "&client_id=PaLV4upJP7"
      ).then(gameData => {
        console.log("gameData ");
        this.setState({ gamelibrary_atlas: gameData.data.games });
      });
    }
  };
  getGameLibrary = () => {
    console.log("getGameLibrary() called");
    db.getGames(localStorage.getItem("apiKey")).then(response => {
      this.setState({ gamelibrary: response.data });
      this.getAtlasInfo();
    });
  };

  gameSearch = searchstring => {
    searchGames(
      "https://www.boardgameatlas.com/api/search?name=" +
        searchstring +
        "&limit=10&client_id=PaLV4upJP7"
    ).then(response => {
      this.setState({
        games: response.data.games
      });
      return response.data.games;
    });
  };

  authorize = body => {
    db.login(body)
      .then(response => {
        if (response.data != "missing or wrong password") {
          localStorage.setItem("apiKey", response.data);
          this.setState({ apiKey: response.data });

          this.getProfile();
        } else {
          alert("Credentials unrecognized. Please try again!");
        }
      })
      .catch(error => {
        localStorage.removeItem("apiKey");
        alert("invalid credentials");
      });
  };

  loggedIn = bool => {
    this.setState({ loggedIn: bool });
  };

  render() {
    return (
      <Router>
        <div className="App">
          <AppNavbar
            username={
              localStorage.getItem("profile")
                ? JSON.parse(localStorage.getItem("profile")).name
                : ""
            }
            apptitle={this.state.apptitle}
            apiKey={localStorage.getItem("apiKey")}
            loggedIn={this.loggedIn}
          ></AppNavbar>

          <Container className="p-3">
            <Switch>
              <Route
                exact
                path="/"
                render={() =>
                  localStorage.getItem("apiKey") == null ? (
                    <Redirect to="/login" />
                  ) : (
                    <Homepage
                      gamelibrary_atlas={this.state.gamelibrary_atlas}
                    ></Homepage>
                  )
                }
              ></Route>
              <Route
                exact
                path="/gamesearch"
                render={props => (
                  <React.Fragment>
                    <GameSearchBox gameSearch={this.gameSearch} />
                    <br />
                    <GameSearch
                      games={this.state.games}
                      gamelibrary={this.state.gamelibrary}
                      updategamelibrary={this.getGameLibrary}
                    />
                  </React.Fragment>
                )}
              ></Route>
              <Route path="/about" component={About}></Route>
              <Route
                path="/login"
                render={() =>
                  localStorage.getItem("apiKey") !== null ? (
                    <Redirect to="/" />
                  ) : (
                    <Login authorize={this.authorize}></Login>
                  )
                }
              ></Route>
            </Switch>
          </Container>
        </div>
      </Router>
    );
  }
}

export default App;
