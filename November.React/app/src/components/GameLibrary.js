import React, { Component } from "react";
import { Table } from "react-bootstrap";
import { Image } from "react-bootstrap";

import "../App.css";
export class GameLibrary extends Component {
  renderTableData() {
    console.log("render table data: ", this.props);
    return this.props.gamelibrary_atlas.map(game => (
      <tr>
        <React.Fragment>
          <td>
            <Image className="gameImage" src={game.images.small}></Image>
          </td>
          <td>{game.name}</td>
        </React.Fragment>
      </tr>
    ));
  }

  render() {
    if (this.props.gamelibrary !== null) {
      return (
        <React.Fragment>
          <h2>Your library</h2>
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
