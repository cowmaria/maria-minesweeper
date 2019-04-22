import {MAX_HEIGHT, MAX_WIDTH} from "../consts/consts";
import {saveCCGroup} from "../storage/storageController";

export function getSetOfRandomsInRange(min, max, n) {
    if (max - min < n) {
        return;
    }
    const resultSet = new Set();
    let counter = 0;
    while (resultSet.size < n) {
        resultSet.add(getRandomInt(min, max + 1));
        counter++;
        if (counter > n * 100000) {
            throw "Something went very wrong"  // counter is just for safety, getRandomInt should work
        }
    }
    return resultSet
}

export function getRandomInt(min, max) { //stolen from developer.mozilla
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

export function getKey(i, j) {
    const key = `${i}-${j}`;
    return key
}

export function isValidGameParams(width, height, minesNumber) {
    return width < MAX_WIDTH + 1 && height < MAX_HEIGHT + 1
        && minesNumber < width * height && width > 0 && height > 0 && minesNumber > 0
}


export function flushCCCells(key, CCCells) {
    saveCCGroup(key, CCCells);
}

export function getBoundaries(row, column, height, width) {
    return {
        top: Math.max(0, row - 1),
        bottom: Math.min(row + 1, height - 1),
        right: Math.min(column + 1, width - 1),
        left: Math.max(0, column - 1),
    }
}
