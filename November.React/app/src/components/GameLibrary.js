import React, { Component } from "react";
import { Table } from "react-bootstrap";
import queryString from "query-string";
import { IsEmpty } from "react-lodash";
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
    const tableItems = props.gamelibrary.map(game => (
      <tr onClick={() => navToGame(game._id)} key={game._id}>
        <td className="tdimage">
          <Image
            key={game.atlas.images.small.toString()}
            className="gameImage"
            src={game.atlas.images.small}
          ></Image>
        </td>
        <td>
          {game.atlas ? game.atlas.name : null}
          <br />
          <div>@{game.user ? game.user.username : null}</div>
        </td>
      </tr>
    ));
    return <tbody>{tableItems}</tbody>;
  }

  searchHandler(event) {
    this.setState({ librarySearch: event.target.value.toLowerCase() });
    // console.log(this.state.librarySearch);
  }

  render() {
    let filteredList = this.props.gamelibrary.filter(game => {
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
    if (this.props.gamelibrary !== []) {
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
          <IsEmpty
            value={JSON.parse(localStorage.getItem("profile")).name}
            yes={() => (
              <a className="btn btn-warning btn-block" href="/profile/edit">
                Setup Profile
              </a>
            )}
            no={() => ""}
          />
          <IsEmpty
            value={JSON.parse(localStorage.getItem("profile")).name}
            yes={() => <div class="text-warning">Missing Name</div>}
            no={() => ""}
          />
          {/* <IsEmpty
            value={JSON.parse(localStorage.getItem("profile")).address}
            yes={() => <div class="text-warning">Missing Address</div>}
            no={() => ""}
          />
          <IsEmpty
            value={JSON.parse(localStorage.getItem("profile")).email}
            yes={() => <div class="text-warning">Missing Email</div>}
            no={() => ""}
          />
          <IsEmpty
            value={JSON.parse(localStorage.getItem("profile")).zip}
            yes={() => <div class="text-warning">Missing Zip</div>}
            no={() => ""}
          />
          <IsEmpty
            value={JSON.parse(localStorage.getItem("profile")).zip}
            yes={() => <div class="text-warning">Missing State</div>}
            no={() => ""}
          />
          <IsEmpty
            value={JSON.parse(localStorage.getItem("profile")).city}
            yes={() => <div class="text-warning">Missing City</div>}
            no={() => ""}
          />
          <IsEmpty
            value={JSON.parse(localStorage.getItem("profile")).phone}
            yes={() => <div class="text-warning">Missing Phone</div>}
            no={() => ""}
          /> */}
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
          <div className="libraryTotal">
            Games: {this.props.gamelibrary.length}
          </div>
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
