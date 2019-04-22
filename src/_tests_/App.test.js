//import {MineSweeperStore} from "./MineSweeperStore";
import ReactDOM from "react-dom";
import React from "react";
import App from "../App";
import {MineSweeperStore} from "../mineSweeperGame/MineSweeperStore";


it('renders without cra3shing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
