import { Checker } from "./checker";
import { PositionType } from "./position-type";
import { PositionDefinition } from './position';
import { CellState } from "./cell-state";

export class Cell<T> {
    public state: CellState;
    constructor(public position: PositionDefinition, public type: PositionType, public element: T) {
        this.state = CellState.Normal;
    }
}