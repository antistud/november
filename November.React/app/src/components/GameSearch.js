import React, { Component } from "react";
import GameInfo from "./GameInfo";
import PropTypes from "prop-types";
import { Table } from "react-bootstrap";
import "../App.css";
export class GameSearch extends Component {
  renderTableData() {
    return this.props.games.map(game => (
      <GameInfo
        key={game.id}
        game={game}
        gamelibrary={this.props.gamelibrary}
        // markAvailable={this.props.markAvailable}
      />
    ));
  }

  render() {
    if (this.props.games.length != 0) {
      return (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th></th>
            </tr>
          </thead>

          <tbody>{this.renderTableData()}</tbody>
        </Table>
      );
    } else {
      return null;
    }
  }
}
GameSearch.propTypes = {
  games: PropTypes.array.isRequired
};
export default GameSearch;
