import React, { Component } from "react";
import { Table } from "react-bootstrap";
import { Image } from "react-bootstrap";

import "../App.css";


export class GameLibrary extends Component {

  navToGame(gameId) {
    console.log(gameId)
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
          <a href={"/Game/" + game._id}>
          {game.atlas.name}
          </a>
        </td>
      </tr>
    ));
    return <tbody>{tableItems}</tbody>;
  }

  render() {
    if (this.props.gamelibrary !== null) {
      return (
        <React.Fragment>
          <h2>Your library</h2>
          
          <Table striped bordered hover>
            <thead>
              <tr>
                <th><a href="/gamesearch" className="btn btn-block "><i   className="fa fa-folder-plus fa-fw fa-2x"></i></a></th>
                <th>Name</th>
                {/* <th></th> */}
              </tr>
            </thead>

            {/* <tbody>{this.renderTableData()}</tbody> */}

            <this.renderTableData
              gamelibrary={this.props.gamelibrary}
            ></this.renderTableData>
          </Table>
        </React.Fragment>
      );
    } else {
      return null;
    }
  }
}

export default GameLibrary;
