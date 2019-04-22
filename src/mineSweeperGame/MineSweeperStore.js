import {action, observable} from "mobx";
import {flushCCCells, getBoundaries, getKey, getSetOfRandomsInRange, isValidGameParams} from "./utils/utils";
import {clearStorage, getAllCCforCCkey, getNumberOfEntries, setNumberOfEntries} from "./storage/storageController";
import {BREAK_LOOP, MAX_OBJ_SIZE_IN_DB, TILE_TYPE} from "./consts/consts";

export class MineSweeperStore {

    @observable superman = false;
    minesLocation = new Set();
    clickedCells = {}
    flaggedCells = {}
    correctFlags = 0;
    @observable flags = 0;
    @observable openedCells = 0;
    @observable numberOfClicks = 0;
    @observable gameNumber = 0;
    boardSize = -1;
    @observable width = -1;
    @observable height = -1;
    @observable loading = false;
    @observable displayWaring = false;
    @observable lost = false;
    emptyCellsMapped = false
    minesNumber = 0
    @observable won = false
    @observable showRules=true

    index2CC = {}
    @observable wrongParams = false

    @action clearAll = async () => {
        this.clickedCells = {};
        this.minesLocation = {};
        this.emptyCellsLocation = {};
        this.flaggedCells = {};
        this.index2CC = {};
        this.flags = 0;
        this.won = false
        this.correctFlags = 0;
        this.openedCells = 0;
        this.numberOfClicks = 0;
        this.lost = false;
        this.superman=false;
        this.wrongParams = false
        this.showRules=false
        await clearStorage();
    };

    @action setShowRules=(showRules)=>{
        this.showRules=showRules
    }
    @action initGameState = async (width, height, minesNumber) => {
        await this.clearAll();
        const minesMapping = this.emptyCellsMapped ? this.placeEmptyCells : this.placeMines
        minesMapping(width, height, minesNumber)
        return this.solveGame()

    };

    @action hideWarning = () => {
        this.displayWaring = false
    }

    @action clickAllCCfromStorage = async (row, column) => {
        const key = getKey(row, column)
        const CC = this.index2CC[key]
        const parts = await getNumberOfEntries(CC)

        for (let i = 1; i <= parts; i++) {
            const key = `${CC}-${i}`
            const cc = await getAllCCforCCkey(key)
            Object.assign(this.clickedCells, cc)
        }
        this.numberOfClicks++;
    };

    @action clickConnectedCells = (row, column) => {
        const visitedCells = [];
        visitedCells.push({row, column});
        this.clickCell(getKey(row, column));
        while (visitedCells.length > 0) {
            const cellIndex = visitedCells.shift()
            const {row, column} = cellIndex
            const boundary = getBoundaries(row, column, this.height, this.width);

            for (let i = boundary.top; i <= boundary.bottom; i++) {
                for (let j = boundary.left; j <= boundary.right; j++) {
                    const key = getKey(i, j)
                    if (this.shouldVisitCell(key, i, j)) {
                        visitedCells.push({row: i, column: j})
                    }
                    this.clickCell(key)
                }

            }
        }
    }

    @action clickCell = (key) => {
        this.clickedCells[key] = true
        this.increaseClicks();
    }

    @action toggleSuperman = () => {
        this.superman = !this.superman
    };

    @action handleClickMine = () => {
        this.lost = true;
    };

    @action closeParamsDialog = () => {
        this.wrongParams = false
    };

    @action handleClickUnrevealedTile = async (row, column) => {
        const key = getKey(row, column)
        if (this.calculateAdjMines(row, column) === 0) {
            const isInStorage = await this.isCCForCellinStorage(key)
            if (isInStorage) {
                this.clickAllCCfromStorage(row, column)
            } else {
                this.clickConnectedCells(row, column)
            }
        }
        this.clickedCells[key] = true;
        this.openedCells = Object.keys(this.clickedCells).length
    };

    @action removeFlag = (i, j) => {
        const key = getKey(i, j)
        if (this.isFlagCorrect(i, j)) {
            this.correctFlags--
        }
        delete this.flaggedCells[key];
        this.flags--;
        this.cleanUpAfterFlagRemoved(key)
    }

    @action newGame = (width, height, minesNumber) => {
        if (!isValidGameParams(width, height, minesNumber)) {
            this.wrongParams = true
            return
        }
        this.chooseBetweenMinesAndEmptyCells(minesNumber)
        this.setLoading(true)
        this.setBoardParams(width, height,minesNumber);
        this.initGameState(width, height, minesNumber).then(res => {
                this.setLoading(false)
            }
        )
    };

    @action addFlag = (i, j) => {
        const key = getKey(i, j)
        if (this.isFlagCorrect(i, j)) {
            this.correctFlags++;
        }
        this.flags++
        this.flaggedCells[key] = true
    }

    @action toggleFlag = (i, j) => {
        const key = getKey(i, j);
        const flagged = this.flaggedCells[key];
        if (flagged) {
            this.removeFlag(i, j)
            return;
        }
        if (this.remainingFlags() > 0) {
            this.addFlag(i, j)
        } else {
            this.displayWaring = true
        }
    };

    @action increaseClicks = () => {
        this.numberOfClicks++
    };

    @action setHaveWon=()=>{
        if ((this.correctFlags + this.openedCells) === this.boardSize) {
            this.won = true
        }
    }
    @action handleClickTileAndCheckWin = (i, j, shiftPressed) => {
        this.handleClickTile(i, j, shiftPressed)
       this.setHaveWon()
    }

    @action setLoading = (loading) => {
        this.loading = loading
    };

    @action setBoardParams = (width, height, minesNumber) => {
        this.width = width;
        this.height = height;
        this.boardSize = width * height;
        this.minesNumber = minesNumber;
    }

    shouldVisitCell = (key, i, j) => {
        return !this.clickedCells[key] && this.calculateAdjMines(i, j) === 0
    }

    solveGame = async () => {
        let CCKey = 0;
        const solveGameScheduler = async () => {
            for (let i = 0; i < this.height; i++) {
                for (let j = 0; j < this.width; j++) {
                    CCKey++;
                    if (!this.index2CC[(getKey(i, j))]) {
                        await this.markConnectedComponnetsSolve(i, j, CCKey)
                    }
                }
            }
            return Promise.resolve("Game solved")
        }

        return new Promise((resolve, reject) => {
                setTimeout(() => {
                    solveGameScheduler().then(r => resolve("resolved"))
                }, 0);
            }
        )

    };

    chooseBetweenMinesAndEmptyCells = (minesNumber) => {
        if (minesNumber > (this.width * this.height) / 2) {
            this.emptyCellsMapped = true
        }
    }

    calculateAdjMines = (row, column) => {
        const boundary = getBoundaries(row, column, this.height, this.width);
        let mineCount = 0;
        for (let i = boundary.top; i <= boundary.bottom; i++) {
            for (let j = boundary.left; j <= boundary.right; j++) {
                if (this.isAMine(i, j)) {
                    mineCount++;
                }
            }
        }
        return mineCount;
    };

    markConnectedComponnetsSolve = (row, column, CC, visitedCells = [], CCCells = {}, parts = 1, numOfCCItems = 0) => {
        visitedCells.push({row, column})
        const indexKey = getKey(row, column);
        this.index2CC[indexKey] = CC.toString()
        CCCells[indexKey] = true;
        numOfCCItems++;
        let loops = 0;
        while (loops < BREAK_LOOP && visitedCells.length > 0) {
            loops++;
            const cellIndex = visitedCells.shift();
            const {row, column} = cellIndex;
            if (numOfCCItems > MAX_OBJ_SIZE_IN_DB) {
                const key = `${CC}-${parts}`;
                flushCCCells(key, CCCells)
                CCCells = {};
                parts++;
                numOfCCItems = 0;
            }
            const boundary = getBoundaries(row, column, this.height, this.width)
            for (let i = boundary.top; i <= boundary.bottom; i++) {
                for (let j = boundary.left; j <= boundary.right; j++) {
                    const key = getKey(i, j);
                    const isSaved = this.index2CC[key]
                    if (!isSaved) {
                        this.index2CC[key] = CC.toString()
                        if (this.calculateAdjMines(i, j) === 0) {
                            visitedCells.push({row: i, column: j})
                        }
                        CCCells[key] = true;
                        numOfCCItems++;
                    }
                }
            }
        }

        if (visitedCells.length < 1) {
            const storageKey = `${CC}-${parts}`;
            if ((Object.keys(CCCells).length + ((parts - 1) * MAX_OBJ_SIZE_IN_DB)) >= MAX_OBJ_SIZE_IN_DB) {
                flushCCCells(storageKey, CCCells);
                setNumberOfEntries(CC.toString(), parts)
            }
            return new Promise((resolve, reject) => resolve("good promise"))
        }

        const cell = visitedCells.shift()
        return new Promise(resolve => setTimeout(() => {
            this.markConnectedComponnetsSolve(cell.row,
                cell.column, CC, visitedCells, CCCells, parts, numOfCCItems).then(x => resolve(x))
        }, 0))

    };

    getCCid = (key) => {
        return this.index2CC[key]
    }

    isCCForCellinStorage = async (key) => {
        const CC = this.getCCid(key)
        return CC && await getNumberOfEntries(CC)
    }

    cleanUpAfterFlagRemoved = (key) => {
        if (this.clickedCells[key]) {
            delete this.clickedCells[key]
            this.openedCells--;
        }
    }

    isFlagCorrect = (i, j) => {
        return this.isAMine(i, j)
    }


    cellAlreadyRevealed = (key) => {
       return this.clickedCells[key] && !this.flaggedCells[key]
    }

    handleClickTile = (i, j, toggleFlag) => {
        const key = getKey(i, j);
        if (this.shouldRevealBoard() || this.cellAlreadyRevealed(key)) {
            return
        }
        this.increaseClicks();
        if (toggleFlag) {
            this.toggleFlag(i, j);
            return
        }
        if(this.flaggedCells[key]){
            return
        }
        if (this.isAMine(i, j)) {
            this.handleClickMine(i, j);
            return;
        }
        this.handleClickUnrevealedTile(i, j);
    };

    isAMine = (i, j) => {
        return this.emptyCellsMapped ?
            !this.emptyCellsLocation.has(i * this.width + j) : this.minesLocation.has(i * this.width + j)
    };


    remainingFlags() {
        return this.minesNumber - this.flags
    }

    placeMines = (width, height, minesNumber) => {
        this.minesLocation = getSetOfRandomsInRange(0, width * height - 1, minesNumber)
    }

    placeEmptyCells = (width, height, minesNumber) => {
        const size = width * height
        this.emptyCellsLocation = getSetOfRandomsInRange(0, width * height - 1, size - minesNumber)

    };

    computeCell = (i, j) => {
        if (this.loading) {
            return TILE_TYPE.UNCLICKED
        }
        const key = getKey(i, j)
        const clicked = this.shouldRevealBoard() || this.clickedCells[key]

        if (this.isAMine(i, j) && clicked) {
            return TILE_TYPE.REVEALED_MINE
        }
        if (this.flaggedCells[key] && !this.shouldRevealBoard()) {
            return TILE_TYPE.FLAG
        }
        return clicked ? TILE_TYPE.CLICKED : TILE_TYPE.UNCLICKED

    }

    shouldRevealBoard() {
        return this.superman || this.won || this.lost
    }

}