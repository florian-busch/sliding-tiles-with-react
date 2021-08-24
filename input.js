"use strict";
import React from "react";
import { RenderPlayingfield } from "./playingField";
import ReactDOM from "react-dom";

const callRender = event => {

  ReactDOM.render(
    <RenderPlayingfield size={event.target.value} />,
    document.querySelector("#app")
  );
};

const InputFieldSize = () => {
 return <div>
   <input type="text" placeholder="Enter number from 1-9" onChange={callRender}></input>
   </div>
};

module.exports = { InputFieldSize };