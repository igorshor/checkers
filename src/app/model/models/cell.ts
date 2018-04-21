import { Checker } from "./checker";
import { PositionType } from "./position-type";
import { PositionDefinition } from './position';
export class Cell {
    constructor(public position: PositionDefinition, public type: PositionType, public checker?: Checker) {

    }
}