import {createMount} from "@material-ui/core/test-utils";
import React from "react";
import {GameTile} from "../GameTile";
import {configure} from "enzyme/build";
import Adapter from "enzyme-adapter-react-16/build";
import {TILE_TYPE} from "../../consts/consts";


configure({adapter: new Adapter()});

describe('Game tile test',()=>{
    it('should render  clicked cell',()=>{
        let mount = createMount()
        const props={
            cellState:TILE_TYPE.CLICKED
        }
        const gameTile = mount(<GameTile {...props}/>)
            // 2 because of withwtyles wrapper
        expect(gameTile.find('#clicked')).toHaveLength(2)
        })
    it('should render flagged cell',()=>{
        let mount = createMount()
        const props={
            cellState:TILE_TYPE.FLAG
        }
        const gameTile = mount(<GameTile {...props}/>)
        expect(gameTile.find('#flagged')).toHaveLength(1)
    })
    it('should render mined cell',()=>{
        let mount = createMount()
        const props={
            cellState:TILE_TYPE.REVEALED_MINE
        }
        const gameTile = mount(<GameTile {...props}/>)
        expect(gameTile.find('#mine-tile')).toHaveLength(1)
    })
    it('should render unclicked cell',()=>{
        let mount = createMount()
        const props={
            cellState:TILE_TYPE.UNCLICKED
        }
        const gameTile = mount(<GameTile {...props}/>)
        // 2 because of withwtyles wrapper
        expect(gameTile.find('#unrevealed-tile')).toHaveLength(2)
    })
})