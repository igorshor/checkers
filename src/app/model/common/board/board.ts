import { IIdentible } from "../interfaces/i-Identible";
import { Cell } from "./cell";
import { IPositionStrategy } from "../interfaces/i-position-strategy";
import { IPosition } from "./position";
import { SelectionContext } from "./selection-context";
import { CellBuilder } from "../builders/cell-builder";

export class Board<T extends IIdentible> {
    private _cells: Cell<T>[][];
    public elementsMap: { [id: string]: T[] };

    constructor(public readonly width: number, public readonly height: number,
        private positionStrategy: IPositionStrategy,
        private _identibles: IIdentible[],
        private _cellBuilder: CellBuilder<T>) {
    }

    get cells(): Cell<T>[][] {
        return this._cells;
    }

    get immutableCells(): Cell<T>[][] {
        const cells: Cell<T>[][] = new Array(this.height).fill([]);
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                const cell = this.cells[i][j];
                cells[i][j] = new Cell<T>({ x: cell.position.x, y: cell.position.y }, cell.type, cell.element);
                cells[i][j].state = cell.state;
            }
        }

        return cells;
    }

    get immutableBoard(): Board<T> {
        const board = new Board<T>(this.width, this.height, this.positionStrategy, this._identibles, this._cellBuilder);
        board.restore(this.immutableCells);

        return board;
    }

    restore(cells: Cell<T>[][]) {
        this._cells = cells;
    }

    public init() {
        this.elementsMap = {};
        this._identibles.forEach((identible: IIdentible) => this.elementsMap[identible.id] = []);

        this._cells = new Array(this.height).fill([]);
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                const position = { x: j, y: i };
                const cell = this._cellBuilder.build(this.positionStrategy, position);

                if (cell.element && this._identibles.findIndex(cell.element.id) >= 0 && this.elementsMap[cell.element.id]) {
                    this.elementsMap[cell.element.id].push(cell.element);
                }

                this._cells[i].push(cell);
            }
        }
    }

    remove(cellContext: SelectionContext, removeFromBoard = false): Cell<T> {
        const elements = this.getEementsById(cellContext.playerId);
        const index = this.getElementIndex(cellContext.playerId, cellContext.elementId);
        const cell = this.getCellByPosition(cellContext.position);

        if (removeFromBoard) {
            elements.splice(index, 1);
        }

        cell.element = undefined;

        return cell;
    }

    add(cellContext: SelectionContext): Cell<T> {
        const elements = this.getEementsById(cellContext.playerId);
        const index = this.getElementIndex(cellContext.playerId, cellContext.elementId);
        const element = elements[index];
        const cell = this.getCellByPosition(cellContext.position);

        if (cell.element) {
            throw new Error('cell allready have an element');
        }

        cell.element = element;

        return cell;
    }

    private getElementIndex(id: string, elementId: number): number {
        const elements = this.elementsMap[id];
        const index = elements.findIndex(element => element.id === elementId);

        if (index < 0) {
            throw new Error('element id does not exist');
        }

        return index;
    }

    private getEementsById(id: string): T[] {
        const elements = this.elementsMap[id];

        if (!elements) {
            throw new Error('id does not exist');
        }

        return elements;
    }

    public getCellByPosition(pos: IPosition): Cell<T> {
        try {
            return this._cells[pos.y][pos.x];
        } catch {
            return undefined;
        }
    }

    public select(predicate: (element: Cell<T>) => boolean): Cell<T>[] {
        return this._cells
            .map((row: Cell<T>[]) => row.filter(predicate))
            .reduce((accumulator: Cell<T>[], currentValue: Cell<T>[]) => {
                accumulator.push(...currentValue);
                return accumulator;
            });
    }
}