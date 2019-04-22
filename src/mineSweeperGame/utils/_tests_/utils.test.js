import {getBoundaries, getRandomInt, getSetOfRandomsInRange} from "../utils";


describe('get random int ', () => {
    it('should be in range', () => {
        const int=getRandomInt(0, 300)
        expect(int).toBeLessThanOrEqual(300)//.toBeGreaterThanOrEqual(0)
        expect(int).toBeGreaterThanOrEqual(0)
        expect(getRandomInt(300, 300)).toBe(300)
    })

})

describe('get Boundaries',()=>{
    it('should return correct for middle',()=>{
        const correctBoundaries={
            top:2,
            bottom:4,
            right:5,
            left:3
        }
        expect(getBoundaries(3,4,9,9)).toEqual(correctBoundaries)
    })
    it('should return correct for border',()=>{
        const correctBoundaries={
            top:0,
            bottom:1,
            right:1,
            left:0
        }
        expect(getBoundaries(0,0,9,9)).toEqual(correctBoundaries)
    })
})

describe('get set of randoms ', () => {
    it('should be of correct length', () => {
        const length=300
        const res=getSetOfRandomsInRange(0,2000,length)
        expect(res.size).toEqual(length)
    })
})