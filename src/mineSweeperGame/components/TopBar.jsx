import * as React from 'react'
import {withStyles} from "@material-ui/core";

const styles = () => ({
    root: {
        color: "white",
        alignItems: "center",
        display: "flex",
        justifyContent: "space-between",
        background: "#4a752c"
    }
});

export const TopBar = withStyles(styles)((props) => {
    return <div className={props.classes.root} style={props.style}>
        {props.children}
    </div>
})