import { Checker } from "./checker";
import { PositionType } from "./position-type";
import { PositionDefinition } from './position';
import { CellState } from "./cell-state";
import { IIdentible } from "../interfaces/i-Identible";

export class Cell<T extends IIdentible> {
    public state: CellState;
    constructor(public position: PositionDefinition, public type: PositionType, public element: T) {
        this.state = CellState.Normal;
    }
}