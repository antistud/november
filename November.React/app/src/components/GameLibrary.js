import React, { Component } from "react";
import { Table } from "react-bootstrap";
import { Image } from "react-bootstrap";
import "../App.css"
export class GameLibrary extends Component {
  renderTableData() {
    return this.props.gamelibrary.map(game => (
      <tr>
        <td>
          <Image className="gameImage" src={game.images.small}></Image>
        </td>
        <td>{game.name}</td>
        <td>
          <i className="fas fa-folder-plus fa-fw fa-3x"></i>
        </td>
      </tr>
    ));
  }

  render() {
    console.log("gamelibrary render");
    if (this.props.gamelibrary !== null) {
      return (
        <React.Fragment>
          <h2>{this.props.username}'s library</h2>
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
        </React.Fragment>
      );
    } else {
      return null;
    }
  }
}

export default GameLibrary;
