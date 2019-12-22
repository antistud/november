import React, { Component } from "react";
import * as moment from "moment";

function GameRequestItem(props) {
  if (props.item) {
    console.log("props", props);
    var item = props.item;

    //let [game, setGame] = useState();
    function markStep(step, requestId) {
      if (step == "rr") {
        Request.markReturnAsRecieved(requestId).then(res => {
          console.log("rr", res);
          props.getGame();
        });
      } else if (step == "rs") {
        Request.markReturnAsSent(requestId).then(res => {
          console.log("rs", res);
          props.getGame();
        });
      } else if (step == "sr") {
        Request.markSendAsRecieved(requestId).then(res => {
          console.log("sr", res);
          props.getGame();
        });
      } else if (step == "ss") {
        Request.markSendAsSent(requestId).then(res => {
          console.log("ss", res);
          props.getGame();
        });
      }
    }

    // console.log("console", r);
    let rr = <i className="far fa-circle"></i>;
    let rs = <i className="far fa-circle"></i>;
    let sr = <i className="far fa-circle"></i>;
    let ss = <i className="far fa-circle"></i>;
    let button = "";
    if (item.return_recieved !== "0001-01-01T00:00:00Z" && item.status == 1) {
      rr = (
        <i
          className="fa fa-circle"
          data-toggle="tooltip"
          data-placement="top"
          title={
            "Recieved: " + moment(item.return_recieved, "YYYYMMDD").fromNow()
          }
        ></i>
      );
    } else if (
      props.game.user_id ===
        JSON.parse(localStorage.getItem("profile")).user_id &&
      item.return_sent !== "0001-01-01T00:00:00Z" &&
      item.status == 1
    ) {
      button = (
        <button
          className="btn btn-block btn-success"
          onClick={() => markStep("rr", item._id)}
        >
          Recieved Back
        </button>
      );
    }

    if (item.return_sent !== "0001-01-01T00:00:00Z" && item.status == 1) {
      rs = (
        <i
          className="fa fa-circle"
          data-toggle="tooltip"
          data-placement="top"
          title={"Sent: " + moment(item.return_sent, "YYYYMMDD").fromNow()}
        ></i>
      );
    } else if (
      item.user_id === JSON.parse(localStorage.getItem("profile")).user_id &&
      item.send_recieved !== "0001-01-01T00:00:00Z" &&
      item.status == 1
    ) {
      button = (
        <button
          className="btn btn-block btn-success"
          onClick={() => markStep("rs", item._id)}
        >
          Send Back
        </button>
      );
    }

    if (item.send_recieved !== "0001-01-01T00:00:00Z" && item.status == 1) {
      sr = (
        <i
          className="fa fa-circle"
          data-toggle="tooltip"
          data-placement="top"
          title={
            "Recieved: " + moment(item.send_recieved, "YYYYMMDD").fromNow()
          }
        ></i>
      );
    } else if (
      item.user_id === JSON.parse(localStorage.getItem("profile")).user_id &&
      item.send_sent !== "0001-01-01T00:00:00Z" &&
      item.status == 1
    ) {
      button = (
        <button
          className="btn btn-block btn-success"
          onClick={() => markStep("sr", item._id)}
        >
          Recieved Game
        </button>
      );
    }

    if (item.send_sent !== "0001-01-01T00:00:00Z" && item.status == 1) {
      ss = (
        <i
          className="fa fa-circle"
          data-toggle="tooltip"
          data-placement="top"
          title={"Sent: " + moment(item.send_sent, "YYYYMMDD").fromNow()}
        ></i>
      );
    } else if (
      JSON.parse(localStorage.getItem("profile")).user_id ===
        props.game.user_id &&
      item.status == 1
    ) {
      button = (
        <button
          className="btn btn-block btn-success"
          onClick={() => markStep("ss", item._id)}
        >
          Send Out
        </button>
      );
    } else if (
      item.status != "1" &&
      JSON.parse(localStorage.getItem("profile")).user_id === props.game.user_id
    ) {
      button = (
        <div>
          <button
            className="btn btn-block btn-success"
            onClick={() => {
              Request.setStatus(item._id, 1).then(data => {
                props.getGame();
              });
            }}
          >
            Accept
          </button>
          <button
            className="btn btn-block btn-success"
            onClick={() => {
              Request.setStatus(item._id, 2).then(data => {
                props.getGame();
              });
            }}
          >
            Decline
          </button>
        </div>
      );
    }
    if (item.user_name && item.status !== 2) {
      return (
        <div className="item">
          <div className="row">
            <div className="col-sm-7">
              <div className="">
                {item.user_name}
                <div>
                  Send:&nbsp;
                  {ss}
                  <i className="fa fa-minus"></i>
                  {sr}
                </div>
                <div>
                  Return:&nbsp;
                  {rs}
                  <i className="fa fa-minus"></i>
                  {rr}
                </div>
              </div>
            </div>
            <div className="col-sm-5">{button}</div>
          </div>
        </div>
      );
    } else if (item.user_name && item.status === 2) {
      return (
        <div className="item">
          <div className="row">
            <div className="col-sm-12">{item.user_name} - Declined</div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}
export default GameRequestItem;
