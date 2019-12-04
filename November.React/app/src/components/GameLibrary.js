import React, { Component } from "react";
import { Table } from "react-bootstrap";
import { Image } from "react-bootstrap";
import searchGames from "../services/SearchGames";
import "../App.css";
export class GameLibrary extends Component {
  state = { gamelibrary: [] };
  componentDidMount() {
    console.log("gamelibrary component did mount");
    const ids = this.props.gamelibrary.toString();
    if (ids) {
      searchGames(
        "https://www.boardgameatlas.com/api/search?ids=" +
          ids +
          "&client_id=PaLV4upJP7"
      ).then(gameData => {
        console.log("game data");
        this.setState({ gamelibrary: gameData.data.games });
      });
    }
  }
  renderTableData() {
    return this.state.gamelibrary.map(game => (
      <tr>
        <td>
          <Image className="gameImage" src={game.images.small}></Image>
        </td>
        <td>{game.name}</td>
        {/* <td>
          <i className="fas fa-folder-plus fa-fw fa-3x"></i>
        </td> */}
      </tr>
    ));
  }

  render() {
    if (this.props.gamelibrary !== null) {
      return (
        <React.Fragment>
          <h2>{this.props.username}'s library</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                {/* <th></th> */}
              </tr>
            </thead>

            <tbody>{this.renderTableData()}</tbody>
          </Table>
        </React.Fragment>
      );
    } else {
      return null;
    }
  }
}

export default GameLibrary;
