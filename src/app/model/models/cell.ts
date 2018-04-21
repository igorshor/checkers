import { Checker } from "./checker";
import { PositionType } from "./position-type";
import { Position } from './position';
export class Cell {
    constructor(public position: Position, public type: PositionType, public checker?: Checker) {

    }
}