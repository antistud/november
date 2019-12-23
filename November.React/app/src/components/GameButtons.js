import React, { Component } from "react";
import * as moment from "moment";

function GameButtons(props) {
  if (
    props.game.user_id !== JSON.parse(localStorage.getItem("profile")).user_id
  ) {
    if (props.showrequest !== false) {
      return (
        <div className="col-sm">
          <a
            href="#"
            className="btn btn-block btn-primary mt-2"
            onClick={() => props.handleNewRequestClick()}
          >
            <i className="fa fa-share-square"></i>
            <br /> Request This Game
          </a>
        </div>
      );
    } else {
      return (
        <div className="col-sm">
          <button href="#" className="btn btn-block btn-primary mt-2" disabled>
            <i className="fa fa-share-square"></i>
            <br /> Request This Game
          </button>
        </div>
      );
    }
  } else {
    return (
      <div className="col-sm">
        <button
          onClick={() => props.deleteGame(props.game._id)}
          className="btn btn-block btn-danger mt-2"
        >
          <i className="fa fa-trash"></i>
          <br />
          Remove Game
        </button>
      </div>
    );
  }
}
export default GameButtons;
