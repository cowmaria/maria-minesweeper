import React, {Component} from 'react';
import {Provider} from "mobx-react";
import {MineSweeperStore} from "./mineSweeperGame/MineSweeperStore";
import MineSweeperGame from "./mineSweeperGame/MineSweeperGame";
import {withStyles} from "@material-ui/core";

const gameStore = new MineSweeperStore();
const MineSweeper = (<Provider GameStore={gameStore}><MineSweeperGame/></Provider>);

const styles = () => ({

    root:{
        backgroundColor:"#2E3439",
        minHeight:"100vh",
        display:"flex",
        justifyContent:"center",
        alignItems:"center"
    }
})

@withStyles(styles)
class App extends Component {
    render() {
        return (
            <div className={this.props.classes.root}>
                {MineSweeper}
            </div>
        );
    }
}

export default App;
