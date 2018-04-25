import { Checker } from "./checker";
import { PositionType } from "./position-type";
import { PositionDefinition } from './position';
import { CellState } from "./cell-state";
export class Cell {
    public state: CellState;
    constructor(public position: PositionDefinition, public type: PositionType, public checker: Checker) {
        this.state = CellState.Normal;
    }
}