import * as React from "react"
import TextField from "@material-ui/core/TextField";
import {withStyles} from "@material-ui/core";

const styles = () => ({

    root: {
        display:"flex",
        alignItems:"flex-end"
        ,flexDirection:"column"
    },

});

export const GameSettings =withStyles(styles)( (props) => {

    function handleKeyPress(ev){
        if(ev.key==="Enter"){
            props.handleNewGame()
        }
    }

    return <div   className={props.classes.root} onKeyPress={handleKeyPress}>
        <TextField
            id="gameWidth"
            label="Columns"
            placeholder="6"
            type="number"
            multiline
            margin="normal"
            value={props.gameWidth}
            onChange={props.handleInput}
        />
        <TextField
            label="Rows"
            placeholder="6"
            type="number" id="gameHeight"
            multiline
            margin="normal"
            value={props.gameHeight}
            onChange={props.handleInput}
        />
        <TextField
            label="Mines"
            placeholder="6"
            multiline
            margin="normal"
            type="number"
            id="mines"
            onChange={props.handleInput}
            value={props.mines}
        />
    </div>
})