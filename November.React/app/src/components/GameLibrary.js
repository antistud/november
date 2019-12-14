import React, { Component } from "react";
import { Table } from "react-bootstrap";
import { Image } from "react-bootstrap";

import "../App.css";

export class GameLibrary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      librarySearch: ""
    };
  }

  navToGame(gameId) {
    console.log(gameId);
  }

  renderTableData(props) {
    console.log("render table data: ", props);
    const tableItems = props.gamelibrary.map(game => (
      <tr key={game._id}>
        <td key={game._id}>
          <Image
            key={game.atlas.images.small.toString()}
            className="gameImage"
            src={game.atlas.images.small}
          ></Image>
        </td>
        <td key={game.atlas.id}>
          <a href={"/Game/" + game._id}>{game.atlas.name}</a>
          <br />
          UserId: {game.user_id}
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
        game.atlas.name.toLowerCase().indexOf(this.state.librarySearch) !== -1
      );
    });
    if (this.props.gamelibrary !== null) {
      return (
        <React.Fragment>
          <h2>All Games</h2>
          <input
            type="text"
            className="form-control"
            placeholder="search"
            onChange={this.searchHandler.bind(this)}
          ></input>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>
                  <a href="/gamesearch" className="btn btn-block ">
                    <i className="fa fa-folder-plus fa-fw fa-2x"></i>
                  </a>
                </th>
                <th>Name</th>
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
