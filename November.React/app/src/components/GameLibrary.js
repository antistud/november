import React, { Component } from "react";
import { Table } from "react-bootstrap";
import queryString from "query-string";
import { useHistory, useRouteMatch, useParams } from "react-router-dom";
import { Image } from "react-bootstrap";

import "../App.css";

export class GameLibrary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      librarySearch: "",
      usernameSearch: null
    };
  }

  componentDidMount() {
    const values = queryString.parse(window.location.search);
    if (values.s != undefined) {
      this.setState({ librarySearch: values.s.toLowerCase() });
    }
    if (values.u != undefined) {
      this.setState({ usernameSearch: values.u.toLowerCase() });
    }
  }

  renderTableData(props) {
    let history = useHistory();
    function navToGame(gameId) {
      console.log(gameId);
      history.push("/Game/" + gameId);
    }
    console.log("render table data: ", props);
    const tableItems = props.gamelibrary
      .filter(game => game.user !== null)
      .map(game => (
        <tr key={game._id}>
          <td onClick={() => navToGame(game._id)} className="tdimage pointer">
            <Image
              key={game.atlas.images.small.toString()}
              className="gameImage"
              src={game.atlas.images.small}
            ></Image>
          </td>
          <td>
            <div className="pointer" onClick={() => navToGame(game._id)}>
              {game.atlas ? game.atlas.name : null}
            </div>

            <br />
            <a href={game.user ? "/?u=" + game.user.username : null}>
              @{game.user ? game.user.username : null}
            </a>
          </td>
        </tr>
      ));
    return <tbody>{tableItems}</tbody>;
  }

  searchHandler(event) {
    this.setState({ librarySearch: event.target.value.toLowerCase() });
    // console.log(this.state.librarySearch);
  }

  profileCheck() {
    if (
      JSON.parse(localStorage.getItem("profile")).username &&
      (JSON.parse(localStorage.getItem("profile")).name == null ||
        JSON.parse(localStorage.getItem("profile")).name == "")
    ) {
      return (
        <div>
          <a className="btn btn-warning btn-block" href="/profile/edit">
            Setup Profile
          </a>
          <div class="text-warning">Missing Name</div>
        </div>
      );
    } else {
      return null;
    }
  }

  render() {
    let filteredList = this.props.gamelibrary
      .filter(game => game.user !== null)
      .filter(game => {
        return (
          (this.state.usernameSearch === null &&
            game.atlas.name.toLowerCase().indexOf(this.state.librarySearch) !==
              -1) ||
          (this.state.usernameSearch !== null &&
            game.user.username.toLowerCase() === this.state.usernameSearch &&
            game.atlas.name.toLowerCase().indexOf(this.state.librarySearch) !==
              -1)
        );
      });
    if (this.props.gamelibrary !== [] && this.props.gamelibrary !== null) {
      return (
        <React.Fragment>
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text" id="basic-addon1">
                @
                {this.state.usernameSearch !== null
                  ? this.state.usernameSearch
                  : "all"}
              </span>
            </div>
            <input
              type="text"
              className="form-control"
              placeholder="search"
              value={this.state.librarySearch}
              onChange={this.searchHandler.bind(this)}
            ></input>
          </div>
          {this.profileCheck()}

          <div className="buttons">
            <div className="row">
              <div className="col-4">
                <a href="/gamesearch" className="btn btn-link btn-block">
                  <i class="fas fa-dice"></i>
                  <br /> Add Game
                </a>
              </div>
              <div className="col-4">
                <a href="/friends" className="btn btn-link btn-block">
                  <i class="fas fa-user-friends"></i>
                  <br /> Friends
                </a>
              </div>
              <div className="col-4">
                <a href="/requests" className="btn btn-link btn-block">
                  <i class="fas fa-share-square"></i>
                  <br /> Requests
                </a>
              </div>
            </div>
          </div>
          <div className="libraryTotal">Games: {filteredList.length}</div>
          <Table striped bordered hover>
            <thead>
              <tr>
                {/* <th>
                  <a href="/gamesearch" className="btn btn-block ">
                    <i className="fa fa-folder-plus fa-fw fa-2x"></i>
                  </a>
                </th>
                <th>Name</th> */}
                {/* <th></th> */}
              </tr>
            </thead>
            {/* <tbody>{this.renderTableData()}</tbody> */}
            <this.renderTableData
              gamelibrary={filteredList}
            ></this.renderTableData>
          </Table>
        </React.Fragment>
      );
    } else {
      return <div>Loading...</div>;
    }
  }
}

export default GameLibrary;
