import React, { Component } from "react";
import { useRouteMatch, useParams } from "react-router-dom";
import Game from "../../services/game";


export class GamePage extends Component {
  constructor(props){
    super(props)
    this.state = {
      game:{
        _id:"",
        atlas:{
          id:"",
          name:""
        }
      }
    }
  }

  componentDidMount() {
    const { match: { params } } = this.props;
    console.log(params.gameId)
    this.gameId =params.gameId;
    Game.getGameDetails(this.gameId,true).then(res=>{
      this.game = res.data;
      console.log("this.game",res.data);
      this.setState({game: res.data});
      console.log("state",this.state)
    })
  }

  render() {
    return <div>{this.state.game.atlas.name} </div>;
  }
}

export default GamePage;
