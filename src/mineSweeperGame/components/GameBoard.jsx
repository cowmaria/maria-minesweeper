import * as React from "react"
import {Grid} from "react-virtualized";
import {inject, observer} from "mobx-react";
import {GameTile} from "./GameTile";
import {MIN_BOARD_HEIGHT, MIN_BOARD_WIDTH, MIN_TILE_SIZE, TILE_TYPE} from "../consts/consts";
import {withStyles} from "@material-ui/core";

const styles = () => ({
    root: {
        outline: 'none',
        padding: "0 18px 18px 0",

    }
});


@withStyles(styles)
@inject('GameStore')
@observer
class GameBoard extends React.Component {

    cellRenderer = ({columnIndex, key, rowIndex, style}) => {
        const {GameStore} = this.props
        const cellType = GameStore.computeCell(rowIndex, columnIndex)
        const adj = cellType === TILE_TYPE.CLICKED ? GameStore.calculateAdjMines(rowIndex, columnIndex) : -1;
        const colorType = (rowIndex + columnIndex) % 2
        return <div className="tile" id={`${rowIndex}-${columnIndex}`} key={key} style={style}>
            <GameTile colorType={colorType} adj={adj} cellState={cellType}/>
        </div>
    }

    render() {
        const store = this.props.GameStore
        const tableH = Math.min(store.height, 20)
        const tableW = Math.min(store.width, 20)
        const superman = store.superman
        const numClicks = store.numberOfClicks
        const TILE_SIZE = getTileSize(tableW, tableH)

        return <Grid cellRenderer={this.cellRenderer}
                     columnCount={store.width}
                     className={this.props.root}
                     rowCount={store.height}
                     columnWidth={TILE_SIZE}
                     height={tableH * TILE_SIZE}
                     width={tableW * TILE_SIZE}
                     rowHeight={TILE_SIZE}
                     clicks={numClicks}
                     superman={superman}
        >
        </Grid>
    }
}

function getTileSize(width, height) {

    const tileWidth = (MIN_BOARD_WIDTH / width) < MIN_TILE_SIZE ?
        MIN_TILE_SIZE : Math.floor(MIN_BOARD_WIDTH / width)
    const tileHeight = (MIN_BOARD_HEIGHT / height) < MIN_TILE_SIZE ?
        MIN_TILE_SIZE : Math.floor(MIN_BOARD_HEIGHT / height)

    return Math.min(tileWidth, tileHeight)
}

export default GameBoard