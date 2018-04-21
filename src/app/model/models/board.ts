import { Cell } from "./cell";
import { PositionStrategy } from "./position-strategy";
import { Position } from "./position";
import { Checker } from "./checker";
import { PositionType } from "./position-type";
import { CellBuilder } from "./builders/cell-builder";

export class Board {
    private _cells: Cell[][];

    constructor(private _size: number, private positionStrategy: PositionStrategy) {
        this.init();
    }

    private init() {
        this._cells = [];
        for (let i = 0; i < this._size; i++) {
            this._cells[i] = [];
            for (let j = 0; j < this._size; j++) {
                const position = new Position(j, i, 1)
                const cell = CellBuilder.build(this.positionStrategy, position);
                
                this._cells[i].push(cell);
            }
        }
    }
}