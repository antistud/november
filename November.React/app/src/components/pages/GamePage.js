import React, { Component } from "react";
import { useRouteMatch, useParams } from "react-router-dom";
import Game from "../../services/game";

export class GamePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      game: {
        _id: "",
        atlas: {
          id: "",
          name: ""
        }
      }
    };
  }

  componentDidMount() {
    const {
      match: { params }
    } = this.props;
    console.log(params.gameId);
    this.gameId = params.gameId;
    Game.getGameDetails(this.gameId, true).then(res => {
      this.game = res.data;
      console.log("this.game", res.data);
      this.setState({ game: res.data });
      console.log("state", this.state);
    });
  }

  createRequestsList = () => {
    let table = [];
    for (let j = 0; j < 5; j++) {
      table.push(<div>Request: {j}</div>);
    }
    return table;
  };

  render() {
    return (
      <div>
        <div className="card">
          <img
            src={this.state.game.atlas.image_url}
            className="card-img-top"
          ></img>
          <div className="card-body">
            <h5 className="card-title">{this.state.game.atlas.name}</h5>
            <p className="card-text">
              Publisher: {this.state.game.atlas.primary_publisher}
            </p>
          </div>
        </div>
        {this.createRequestsList()}
      </div>
    );
  }
}

export default GamePage;
