import * as React from "react"
import {RedFlag} from "../assets/RedFlag";
import {Bomb} from "../assets/Bomb";
import {withStyles} from '@material-ui/core/styles';
import {TILE_TYPE} from "../consts/consts";

const styles = () => ({
        tile: {
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            boxSizing: "border-box",
            userSelect: "none"

        },
        unrevealedTile: {

            '&:hover':
                {
                    backgroundColor: "#b3e652",
                },
        },
        unrevealed0: {
            backgroundColor: "#a2d149",
        },
        unrevealed1: {
            backgroundColor: "#aad751",
        },
        emptyTile: {
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },
        empty0: {
            backgroundColor: "#d7b899",
        },
        empty1: {
            backgroundColor: "#e5c29f",
        },
        revealed: {
            backgroundColor: "#FFFAFA"
        },
        adj1: {
            color: "#005EFF"
        },
        adj2: {
            color: "#56CD56"
        },
        adj3: {
            color: "#FFAB00"
        },
        adj4: {
            color: "#FF3300"
        },
        adj5: {
            color: "#FF0044"
        },

    })
;

const FlaggedTile = function (props) {
    return <UnrevealedTile colorType={props.colorType}>
        <RedFlag width="70%"/>
    </UnrevealedTile>
}

const MineTile = function (props) {
    return <UnrevealedTile colorType={props.colorType}>
        <Bomb width="70%"/>
    </UnrevealedTile>
}

const UnrevealedTile = withStyles(styles)(function (props) {
    const colorType = props.colorType
    const classes = props.classes
    const colorClass = props.classes[`unrevealed${colorType}`]
    return <div className={[classes.tile, classes.unrevealedTile, colorClass].join(' ')}>
        {props.children}
    </div>
})

const EmptyTile = withStyles(styles)(function (props) {
    const colorClass = props.classes[`empty${props.colorType}`]
    return <div className={[props.classes.emptyTile, colorClass].join(' ')}>{props.children}</div>
})

const ClickedTile = withStyles(styles)(function (props) {
    const {adjMines} = props
    const className = adjMines > 5 ? props.classes.adj5 : props.classes[`adj${adjMines}`]
    return <div className={[props.classes.tile, className].join(" ")}>
        <EmptyTile colorType={props.colorType}>
            {adjMines > 0 && adjMines}
        </EmptyTile>
    </div>
})

export class GameTile extends React.PureComponent {
    render() {
        return (() => {
            switch (this.props.cellState) {
                case TILE_TYPE.FLAG:
                    return <FlaggedTile id='flagged' colorType={this.props.colorType}/>;
                case TILE_TYPE.REVEALED_MINE:
                    return <MineTile id='mine-tile' colorType={this.props.colorType}/>
                case TILE_TYPE.UNCLICKED:
                    return <UnrevealedTile id='unrevealed-tile' colorType={this.props.colorType}/>
                case TILE_TYPE.CLICKED:
                    return <ClickedTile id='clicked'  colorType={this.props.colorType} adjMines={this.props.adj}/>;
                default:
                    return null;
            }
        })()
    }

};