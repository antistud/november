import React, { Component } from "react";
import GameInfo from "./GameInfo";
import PropTypes from "prop-types";
import { Table } from "react-bootstrap";
import "../App.css";
export class GameLibrary extends Component {
  renderTableData() {
    return this.props.games.map(game => (
      <GameInfo
        key={game.id}
        game={game}
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
GameLibrary.propTypes = {
  games: PropTypes.array.isRequired
};
export default GameLibrary;
