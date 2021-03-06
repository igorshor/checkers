import { IIdentible } from "../interfaces/i-Identible";
import { CellState } from "./cell-state";
import { IPosition } from "./position";
import { PositionType } from "./position-type";
import { PositionHelper } from "./position-helper";

export class Cell<T extends IIdentible> {
    public state: CellState;
    constructor(public position: IPosition, public type: PositionType, public element: T) {
        this.state = CellState.Normal;
    }

    public get id(): string {
        return PositionHelper.getPositionId(this.position)
    }

    public mutateObject(): Cell<T> {
        const cell = new Cell<T>(this.position, this.type, this.element?.mutate() as T);
        cell.state = this.state;
        return cell;
    }
}