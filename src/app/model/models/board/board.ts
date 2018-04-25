import { Cell } from "./cell";
import { PositionDefinition } from "./position";
import { Checker } from "./checker";
import { PositionType } from "./position-type";
import { CellBuilder } from "../builders/cell-builder";
import { IPositionStrategy } from "../interfaces/i-position-strategy";
import { MoveType } from "../move/move-type";
import { CheckerState } from "./checker-state";
import { IContextProvider } from "../interfaces/i-context-provier";
import { MoveDescriptor } from "../move/move-descriptor";

export class Board<T> {
    public cells: Cell<T>[][];

    constructor(public size: number, private positionStrategy: IPositionStrategy, private _contextProvider: IContextProvider) {
        this.init();
    }

    private init() {
        this.cells = [];
        for (let i = 0; i < this.size; i++) {
            this.cells[i] = [];
            for (let j = 0; j < this.size; j++) {
                const position = new PositionDefinition(j, i, 1)
                const cell = CellBuilder.build(this.positionStrategy, position);

                this.cells[i].push(cell);
            }
        }
    }

    move(moveDescriptor: MoveDescriptor): Cell<T>[] {
        const changedCells: Cell<T>[] = []
        switch (moveDescriptor.type) {
            case MoveType.Move:
                changedCells.push(this.remove(moveDescriptor.from));
                changedCells.push(this.add(moveDescriptor.to));
                break;
            case MoveType.Eat:
                changedCells.push(this.remove(moveDescriptor.from));
                changedCells.push(this.add(moveDescriptor.to));
                break;
        }

        return changedCells;
    }

    private eatMove(from: PositionDefinition, to: PositionDefinition) {

    }

    private add(pos: PositionDefinition) {
        const cell = this.getCellByPosition(pos);
        cell.checker.state = CheckerState.Game;
        cell.checker.id = this._contextProvider.current;

        return cell;
    }

    private remove(pos: PositionDefinition) {
        const cell = this.getCellByPosition(pos);
        cell.checker.state = CheckerState.Dead;

        return cell;
    }

    public getCellByPosition(pos: PositionDefinition): Cell<T> {
        return this.cells[pos.y][pos.x];
    }

    public getCheckersById(id: any): Cell[] {
        return this.cells
            .map((row: Cell[]) => row.filter((cell: Cell) => cell.checker.id === id))
            .reduce((accumulator: Cell[], currentValue: Cell[]) => {
                accumulator.push(...currentValue);
                return accumulator;
            })
    }
}