import React, { Component } from "react";
import { Container } from "react-bootstrap";
import "./App.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUserCircle, faUserEdit } from "@fortawesome/free-solid-svg-icons";

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom";

import searchGames from "./services/SearchGames";

import Game from "./services/game";
import Auth from "./services/auth";
import AppNavbar from "./components/AppNavbar";
import Friends from "./components/pages/Friends";
import Profile from "./components/pages/Profile";
import GameSearchBox from "./components/GameSearchBox";
import GameSearch from "./components/GameSearch";
import About from "./components/pages/About";
import Homepage from "./components/pages/Homepage";
import ProfileEdit from "./components/pages/ProfileEdit"
import Login from "./components/pages/Login";
import GamePage from "./components/pages/GamePage";

library.add(faUserCircle, faUserEdit);
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apptitle: "BoxShare",
      games: [],
      gamelibrary: [],
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
    }
  }

  getProfile() {
    Auth.getProfile(localStorage.getItem("apiKey"))
      .then(profile => {
        localStorage.setItem("profile", JSON.stringify(profile.data));
        // console.log(profile);
      })
      .catch(error => {
        alert(error);
      });
  }

  getGameLibrary = () => {
    var games = [];
    Game.getGames().then(response => {
      for (let g in response.data) {
        games.push(response.data[g]);
      }
      Game.getFriendsGames().then(response2 => {
        for (let g2 in response2.data) {
          games.push(response2.data[g2]);
        }
        this.setState({ gamelibrary: games });
      });
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
    Auth.login(body)
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
    if (bool === false) {
      this.setState({ gamelibrary: [] });
    }
  };

  loginRedirect = (isAuthed, notAuthed) =>
    localStorage.getItem("apiKey") !== null ? isAuthed : notAuthed;

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
                  this.loginRedirect(
                    <Homepage gamelibrary={this.state.gamelibrary}></Homepage>,
                    <Redirect to="/login" />
                  )
                }
              ></Route>
              <Route
                path="/friends"
                render={() =>
                  this.loginRedirect(<Friends />, <Redirect to="/login" />)
                }
              ></Route>
              <Route path="/game/:gameId">
                <GamePage></GamePage>
              </Route>

              <Route
                path="/profile/edit"
                render={() =>
                  this.loginRedirect(
                    <ProfileEdit
                      profile={JSON.parse(localStorage.getItem("profile"))}
                    />,
                    <Redirect to="/login" />
                  )
                }
              ></Route>
              <Route
                path="/profile"
                render={() =>
                  this.loginRedirect(
                    <Profile
                      profile={JSON.parse(localStorage.getItem("profile"))}
                    />,
                    <Redirect to="/login" />
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
                  this.loginRedirect(
                    <Redirect to="/" />,
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
