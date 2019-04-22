import * as React from "react"
import {RedFlag} from "../assets/RedFlag";
import {withStyles} from "@material-ui/core";

const styles = () => ({

    root: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontSize:"16px",
        width:"fit-content",
        whiteSpace: "nowrap",
        height: "50px",
        padding:"4px",

    }
});
export const FlagsLeft = withStyles(styles)(function (props) {
    return <div className={props.classes.root}>
        <RedFlag width={"20px"}/>
            {` X${props.flags}`}

    </div>
})
