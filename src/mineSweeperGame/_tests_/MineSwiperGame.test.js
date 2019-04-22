import {Provider} from "mobx-react";

import React from "react";
import {createMount} from "@material-ui/core/test-utils";
import {MineSweeperStore} from "../MineSweeperStore";
import MineSweeperGame from "../MineSweeperGame";
import {configure} from "enzyme";
import Adapter from 'enzyme-adapter-react-16';

configure({adapter: new Adapter()});

describe('Mine Sweeper game test', function () {

    it(' render components ', function () {
        const store = new MineSweeperStore()
        let mount = createMount()
        const game = mount(<Provider GameStore={store}><MineSweeperGame/></Provider>)

        expect(game.find('GameTile')).toHaveLength(36)
        expect(game.find('AlertDialog')).toHaveLength(4)
        expect(game.find('#game-cotainer')).toHaveLength(1)

    })
    it('should call click from store', () => {
        const store = new MineSweeperStore()
        let mount = createMount()
        store.handleClickTileAndCheckWin = jest.fn()
        const game = mount(<Provider GameStore={store}><MineSweeperGame/></Provider>)
        store.newGame(6, 6, 2)
        store.loading = false

        game.find('#game-cotainer').simulate('click', {
            target: {
                value: "0-0", closest: () => {
                    return {id: '0-0'}
                }
            }
        })
        expect(store.handleClickTileAndCheckWin).toHaveBeenCalled()
    })
    it('should call toggle superman from store', () => {
        const store = new MineSweeperStore()
        let mount = createMount()
        store.loading = false
        store.toggleSuperman = jest.fn()
        const game = mount(<Provider GameStore={store}><MineSweeperGame/></Provider>)
        game.find('#superman').simulate('click')
        expect(store.toggleSuperman).toHaveBeenCalled()
    })
    it('should call new game from store', () => {
        const store = new MineSweeperStore()
        store.newGame = jest.fn()
        let mount = createMount()
        const game = mount(<Provider GameStore={store}><MineSweeperGame/></Provider>)
        store.loading = false
        game.find('#new-game-button').first().simulate('click')
        expect(store.newGame).toHaveBeenCalled()
    })
})

