import React, { Component } from "react";
import GameSearch from "./components/GameSearch";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import "./App.css";

import searchGames from "./services/SearchGames";
import db from "./services/db"
import AppNavbar from "./components/AppNavbar";
import GameSearchBox from "./components/GameSearchBox";
import { Container } from "react-bootstrap";
import About from "./components/pages/About";
import Homepage from "./components/pages/Homepage";
import Login from "./components/pages/Login"
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apptitle: "BoxShare",
      games: [],
      gamelibrary: [],
      username: "jfloth",
      uderId: "1",
      otherlibraries: [{ username: 'jrhoades', userId: '2', gamelibrary: [] }],
      authorize: { username: "", password: "" }
    };
  }
  isAuthed() {
    if (localStorage.getItem('apiKey') !== null) {
      console.log('apikey exists', localStorage.getItem('apiKey'))
      return (<Route exact path="/">
        <Homepage
          username={this.state.username}
          gamelibrary={this.state.gamelibrary}
        ></Homepage></Route>)
    }
    else {
      console.log('no apikey')
      return (<Route exact path="/">
        <Login authorize={this.authorize}></Login></Route>)
    }
  }
  componentDidMount() {
    this.isAuthed();
    if (!localStorage.getItem("gamelibrary") !== null) {
      this.setState({
        gamelibrary: JSON.parse(localStorage.getItem("gamelibrary"))
      });
    } else {
      localStorage.setItem("gamelibrary", JSON.stringify([]));
    }
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

    db.login(
      "http://november.garishgames.com/auth", body
    ).then(response => {
      console.log(response);
      localStorage.setItem('apiKey', response.data)

      return <Redirect to="/" />;
    });

    console.log(this.state.apiKey);
  };

  saveGame = game => {
    var currentlist = JSON.parse(localStorage.getItem("gamelibrary")) || [];
    currentlist.push(game);
    console.log(JSON.parse(localStorage.getItem("gamelibrary")));
    localStorage.setItem("gamelibrary", JSON.stringify(currentlist));
    this.setState({
      gamelibrary: JSON.parse(localStorage.getItem("gamelibrary"))
    });
  };
  render() {
    const selectHomepage = this.isAuthed()
    return (
      <Router>
        <div className="App">
          <AppNavbar
            username={this.state.username}
            apptitle={this.state.apptitle}
            apiKey={localStorage.getItem('apiKey')}
          ></AppNavbar>

          <Container className="p-3">
            <Route exact path="/">
              {selectHomepage}
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
                    saveGame={this.saveGame}
                    gamelibrary={this.state.gamelibrary}
                  />
                </React.Fragment>
              )}
            ></Route>
            <Route path="/about" component={About}></Route>
            <Route path="/login" ><Login authorize={this.authorize}></Login></Route>
          </Container>
        </div>
      </Router>
    );
  }
}

export default App;
