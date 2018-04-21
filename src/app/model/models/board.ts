import { Cell } from "./cell";
import { PositionStrategy } from "./position-strategy";
import { PositionDefinition } from "./position";
import { Checker } from "./checker";
import { PositionType } from "./position-type";
import { CellBuilder } from "./builders/cell-builder";

export class Board {
    public cells: Cell[][];

    constructor(public size: number, private positionStrategy: PositionStrategy) {
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
}