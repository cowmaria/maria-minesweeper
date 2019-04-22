import * as React from "react"
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import {withStyles} from "@material-ui/core";

const styles = () => ({
        root: {
            display: "flex", alignItems: "center", paddingLeft: "10px"
        },
        label: {
            position: "relative",
            right: "20px",
            '&:hover': {
                cursor: "pointer"
            }
        },
    }
);

export const Superman = withStyles(styles)((props) => {
    return <div className={props.classes.root}>
        <FormControlLabel
            control={
                <Checkbox onChange={props.toggle} icon={<FavoriteBorder/>} checkedIcon={<Favorite/>}
                          checked={props.value}/>
            }
        />
        <div id='superman' onClick={props.toggle} className={props.classes.label}>Superman</div>
    </div>
})