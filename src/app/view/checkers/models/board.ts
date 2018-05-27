import { Cell } from "./cell";

export class Board {
    public readonly cells: Cell[][];
    constructor(public width: number, public height: number) {
        this.cells = [new Array(this.height)].fill([]);
    }
}