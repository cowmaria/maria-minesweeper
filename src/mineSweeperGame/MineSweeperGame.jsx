import * as React from "react"
import {inject, observer} from "mobx-react";
import GameBoard from "./components/GameBoard";
import {GameSettings} from "./components/GameSettings";
import {FlagsLeft} from "./components/FlagsLeft";
import AlertDialog from "./components/AlertDialog";
import {withStyles} from "@material-ui/core";
import {Superman} from "./components/SupermanCheckbox";
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from "@material-ui/core/Button";
import {TopBar} from "./components/TopBar";

const styles = () => ({

        root: {
            display: "grid",
            padding: "10px",
            margin: "10px",
            gridTemplateColumns: "minmax(80px,min-content) min-content",
        },
        gameSettings: {
            gridColumn: "1",
            gridRow: "2/3",
            background: "#b648f2",
            padding: "12px"
        },
        buttonArea: {
            background: "#ffcd1a"
        },
        button: {
            height: "100%",
            width: "100%",
            color: "white"
        },
        loading: {
            position: "absolute",
            zIndex: "100",
            width: "100%"
        }
    })
;

@inject('GameStore')
@withStyles(styles)
@observer
class MineSweeperGame extends React.Component {
    state = {
        gameHeight: 6,
        gameWidth: 6,
        mines: 2,
    }

    startGame = () => {
        const {GameStore} = this.props;
        GameStore.newGame(this.state.gameWidth, this.state.gameHeight, this.state.mines)
    }

    componentDidMount() {
        this.startGame();
        this.handleShowRules()
    }

    handleNewGame = () => {
        this.startGame()
    }


    handleTileClick = (ev) => {
        const tile = ev.target.closest('.tile')
        if (!tile || this.props.GameStore.loading) {
            return
        }
        const [rowIndex, columnIndex] = tile.id.split("-");
        if (!rowIndex || !columnIndex) {
            throw "failed to parse tile id"
        }
        try {
            this.props.GameStore.handleClickTileAndCheckWin(parseInt(rowIndex), parseInt(columnIndex), ev.shiftKey)
        } catch (e) {
            throw "probably failed to parse tile id" + e
        }
    }

    handleInput = (ev) => {
        const val = parseInt(ev.target.value)
        this.setState({[ev.target.id]: val ? val : ''});
    }

    handleShowRules = () => {
        const {GameStore} = this.props
        GameStore.setShowRules(true)
    }
    handleCloseRules = () => {
        const {GameStore} = this.props
        GameStore.setShowRules(false)
    }

    render() {
        const {GameStore, classes} = this.props;
        const NotValidDialog =
            <AlertDialog
                open={GameStore.wrongParams}
                handleOk={GameStore.closeParamsDialog}
                title={"Oopsie!"}
                text="Valid Field size:  1-300 :Valid Mines Number: 1- Game Board Size   "
                handleClose={GameStore.closeParamsDialog}/>
        const WonDialog =
            <AlertDialog open={GameStore.won}
                         handleOk={this.startGame}
                         text="Can you do it again?"
                         title={"Woohoo!"}/>
        const LostDialog =
            <AlertDialog
                open={GameStore.lost}
                handleOk={this.startGame}
                text="Let's try again!"
                title={"Boom :("}/>
        const NoFlagsDialog =
            <AlertDialog title="Out of flags"
                         handleOk={GameStore.hideWarning}
                         open={GameStore.displayWaring}
                         handleClose={GameStore.hideWarning}/>

        const RulesDialog =
            <AlertDialog title="Hey You! "
                         text="Use Shift key and click to place flags"
                         handleOk={this.handleCloseRules}
                         open={GameStore.showRules}
                         handleClose={this.handleCloseRules}/>

        return <div id='game-cotainer' className={classes.root} onClick={this.handleTileClick}>
            <div className={classes.gameSettings}>
                <GameSettings handleNewGame={this.handleNewGame}
                              handleInput={this.handleInput} gameHeight={this.state.gameHeight}
                              gameWidth={this.state.gameWidth}
                              mines={this.state.mines}/>
            </div>
            <TopBar style={{gridRow: "1", gridColumn: "2/4"}}>
                <Superman toggle={GameStore.toggleSuperman} value={GameStore.superman}/>
                <FlagsLeft flags={GameStore.minesNumber - GameStore.flags}/>
            </TopBar>
            <div style={{gridRow: "1", gridColumn: "1"}} className={classes.buttonArea}>
                <Button id='new-game-button' className={classes.button} color="inherit"
                        onClick={this.handleNewGame}>
                    Go!
                </Button>
            </div>
            <div style={{gridRow: "2/3 ", gridColumn: "2", position: "relative"}}>
                {GameStore.loading && <LinearProgress className={classes.loading}/>}
                <GameBoard/>
            </div>
            {WonDialog}
            {LostDialog}
            {NoFlagsDialog}
            {NotValidDialog}
            {RulesDialog}

        </div>
    }
}

export default MineSweeperGame