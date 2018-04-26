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
import { IIdentible } from "../interfaces/i-Identible";

export class Board<T extends IIdentible> {
    public cells: Cell<T>[][];
    public elementsMap: { [id: number]: T[] }

    constructor(public size: number, private positionStrategy: IPositionStrategy, private _identibles: IIdentible[], private _cellBuilder: CellBuilder<T>) {
        this.init();
    }

    private init() {
        this.elementsMap = {}
        this._identibles.forEach((identible: IIdentible) => this.elementsMap[identible.id] = [])

        this.cells = [];
        for (let i = 0; i < this.size; i++) {
            this.cells[i] = [];
            for (let j = 0; j < this.size; j++) {
                const position = new PositionDefinition(j, i, 1)
                const cell = this._cellBuilder.build(this.positionStrategy, position);

                if (cell.element && this._identibles.findIndex(cell.element.id) >= 0 && this.elementsMap[cell.element.id]) {
                    this.elementsMap[cell.element.id].push(cell.element);
                }

                this.cells[i].push(cell);
            }
        }
    }

    remove(moveDescriptor: MoveDescriptor) {
        const elementMap = this.elementsMap[moveDescriptor.playerId];
        if (!elementMap) {
            throw new Error('id dous not exist');
        }

        elementMap.findIndex(element => element.id === '');
    }

    move(moveDescriptor: MoveDescriptor): Cell<T>[] {
        const changedCells: Cell<T>[] = []
        switch (moveDescriptor.type) {
            case MoveType.Move:
                changedCells.push(this.remove(moveDescriptor.from));
                changedCells.push(this.add(moveDescriptor.to));
                break;
            case MoveType.Atack:
                changedCells.push(this.remove(moveDescriptor.from));
                changedCells.push(this.add(moveDescriptor.to));
                break;
        }

        return changedCells;
    }

    public getCellByPosition(pos: PositionDefinition): Cell<T> {
        return this.cells[pos.y][pos.x];
    }

    public getCellsByPredicate(predicate: (element: Cell<T>) => boolean): Cell<T>[] {
        return this.cells
            .map((row: Cell<T>[]) => row.filter(predicate))
            .reduce((accumulator: Cell<T>[], currentValue: Cell<T>[]) => {
                accumulator.push(...currentValue);
                return accumulator;
            })
    }
}