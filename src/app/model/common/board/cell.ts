import { IIdentible } from "../interfaces/i-Identible";
import { CellState } from "./cell-state";
import { PositionDefinition } from "./position";
import { PositionType } from "./position-type";

export class Cell<T extends IIdentible> {
    public state: CellState;
    constructor(public position: PositionDefinition, public type: PositionType, public element: T) {
        this.state = CellState.Normal;
    }
}