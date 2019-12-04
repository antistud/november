import React, { Component } from "react";
import GameSearch from "./components/GameSearch";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";

import searchGames from "./services/SearchGames";
import db from "./services/db";
import AppNavbar from "./components/AppNavbar";
import GameSearchBox from "./components/GameSearchBox";
import { Container } from "react-bootstrap";
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
      username: "jfloth",
      otherlibraries: [],
      authorize: { username: "", password: "" }
    };
    this.isAuthed();
    if (localStorage.getItem("apiKey") !== null) {
      this.getGameLibrary();
    }
  }
  selectHomepage() {
    if (localStorage.getItem("apiKey") !== null) {
      // console.log("apikey exists", localStorage.getItem("apiKey"));
      return (
        <Route exact path="/">
          <Homepage
            username={this.state.username}
            gamelibrary={this.state.gamelibrary}
          ></Homepage>
        </Route>
      );
    } else {
      // console.log("no apikey");
      return (
        <Route exact path="/">
          <Login authorize={this.authorize}></Login>
        </Route>
      );
    }
  }
  isAuthed() {
    db.getProfile(localStorage.getItem("apiKey"))
      .then(profile => {
        localStorage.setItem("profile", JSON.stringify(profile.data));
        // console.log(profile);
      })
      .catch(error => {
        alert(error);
      });
  }

  getGameLibrary() {
    db.getGames(localStorage.getItem("apiKey")).then(response => {
      const ids = response.data.map(game => {
        return game.atlas_id;
      });
      this.setState({ gamelibrary: ids });
      console.log(this.state);
    });
  }
  componentDidMount() {
    //localStorage.clear();
    //console.log(JSON.parse(localStorage.getItem("gamelibrary")));
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
    searchGames(
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

  authorize = body => {
    db.login(body)
      .then(response => {
        console.log("auth response: ", response);
        if (response.data != "missing or wrong password") {
          localStorage.setItem("apiKey", response.data);
          this.isAuthed();
        } else {
          alert("Credentials unrecognized. Please try again!");
        }
      })
      .catch(error => {
        localStorage.removeItem("apiKey");
        alert("invalid credentials");
      });
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
          ></AppNavbar>

          <Container className="p-3">
            <Route exact path="/">
              {this.selectHomepage()}
            </Route>
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
                  />
                </React.Fragment>
              )}
            ></Route>
            <Route path="/about" component={About}></Route>
            <Route path="/login">
              <Login authorize={this.authorize}></Login>
            </Route>
          </Container>
        </div>
      </Router>
    );
  }
}

export default App;
