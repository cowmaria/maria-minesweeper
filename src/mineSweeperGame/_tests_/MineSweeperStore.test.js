import {MineSweeperStore} from "../MineSweeperStore";
import {getKey} from "../utils/utils";

describe("Mine Sweeper store", () => {
    describe('basic functionality tests', () => {
        const store = new MineSweeperStore()
        it('should win', function () {
            store.correctFlags = 2
            store.openedCells=4
            store.boardSize=6
            store.setHaveWon()
            expect(store.won).toBeTruthy()
        })
        it('should not win', function () {
            store.flaggedCells = 2
            store.clickedCells = 3
            store.minesNumber = 5
            expect(store.setHaveWon()).toBeFalsy()
        })
        it('should loos',function () {
            store.handleClickMine()
            expect(store.lost).toBeTruthy()
        })
        it('set loading', function () {
            store.setLoading(true)
            expect(store.loading).toBeTruthy()
            store.setLoading(false)
            expect(store.loading).toBeFalsy()

        })
        it('map empty cells', function () {
            store.width = 20
            store.height = 20
            store.chooseBetweenMinesAndEmptyCells(201)
            expect(store.emptyCellsMapped).toBeTruthy()

        })
        it('add flag', function () {
            store.flags = 0
            store.flaggedCells = {}
            store.isAMine = jest.fn(x => false)
            store.addFlag(1, 1)
            expect(store.flags).toBe(1);
            expect(store.flaggedCells[getKey(1, 1)]).toBeTruthy()
        })
        it('remove flag', function () {
            store.flags = 1
            store.isAMine = jest.fn(x => false)
            store.flaggedCells = {[getKey(1, 1)]: true}
            store.removeFlag(1, 1)
            expect(store.flags).toBe(0);
            expect(store.flaggedCells[getKey(1, 1)]).toBeFalsy()
        })

    })
})