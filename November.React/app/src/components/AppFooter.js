import React, { Component, useEffect, useState } from "react";
import * as moment from "moment";
import { useHistory, useRouteMatch, useParams } from "react-router-dom";

function AppFooter(props) {
  //Mobile Footer
  return (
    <div className="footer">
      <div className="row">
        <div className="col-3">
          <a href="/" className="btn btn-link btn-block">
            <i class="fas fa-home fa-3x"></i>
            <br /> Home
          </a>
        </div>
        <div className="col-3">
          <a href="/gamesearch" className="btn btn-link btn-block">
            <i class="fas fa-dice fa-3x"></i>
            <br /> Add Game
          </a>
        </div>
        <div className="col-3">
          <a href="/friends" className="btn btn-link btn-block">
            <i class="fas fa-user-friends fa-3x"></i>
            <br /> Friends
          </a>
        </div>
        <div className="col-3">
          <a href="/requests" className="btn btn-link btn-block">
            <i class="fas fa-share-square fa-3x"></i>
            <br />
            Requests
          </a>
        </div>
      </div>
    </div>
  );
}
export default AppFooter;
