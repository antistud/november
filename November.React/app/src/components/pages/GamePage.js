import React, { Component,useEffect,useState} from "react";
import { useHistory, useRouteMatch, useParams } from "react-router-dom";
import Game from "../../services/game";

  function GamePage(props) {
    let history = useHistory();
    let [game, setGame] = useState();
    let { gameId } = useParams();
    let { url } = useRouteMatch();
    useEffect(async () => {
       Game.getGameDetails(gameId).then(res => {
        setGame(res.data);    
    });
    }, []);

  function createRequestsList() {
    let table = [];
    for (let j = 0; j < 5; j++) {
      table.push(<div>Request: {j}</div>);
    }
    return table;
  };

  function deleteGame(gameId) {
    console.log(gameId)
   
    Game.deleteGame(gameId).then(res=>{
      console.log("delete game",res.data)
      window.location.replace("/")
    })
  }

if(game && game.atlas){
  return (
      <div className="container">
        <div className="row">
          <div className="col-sm-7">
           <div className="card gameDetails">
          <img
            src={game.atlas.image_url}
            className="card-img-top"
          ></img>
          <div className="card-body">
            <h5 className="card-title">{game.atlas.name}</h5>
            <p className="card-text">
              Publisher: {game.atlas.primary_publisher}
            </p>
          </div>
          <div className="card-footer text-right">
          More Details
          </div>
        </div> 
        </div>        
        <div className="col-sm-5">
              <div className="row">
          <div className="col-sm">
<a href="#" className="btn btn-block btn-primary mt-2"><i className="fa fa-dice"></i><br />Record Play</a>
          </div>
      
<div className="col-sm">
<a href="#" className="btn btn-block btn-primary mt-2"> <i className="fa fa-share-square"></i><br /> Add Request</a>
          </div> 
          
          <div className="col-sm">
<button onClick={() => deleteGame(game._id)} className="btn btn-block btn-danger mt-2"><i className="fa fa-trash"></i><br />Remove</button>
          </div>
          </div>

        <div className="card ">
        <div className="card-header">
          Recent Plays
        </div>
        <div className="card-body">
        {createRequestsList()}
        </div>
        <div className="card-footer text-right">
          View All
          </div>
        </div>

        <div className="card">
        <div className="card-header">
          Open Requests
        </div>
        <div className="card-body">
        {createRequestsList()}
        </div>
        <div className="card-footer text-right">
        View All
          </div>
        </div>
        </div>
        </div>

      </div>
    );

}else{
  return(
    <div className="loading">Loading...</div>
  )
}
}

export default GamePage;
