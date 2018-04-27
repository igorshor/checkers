import { IIdentible } from "../interfaces/i-Identible";
import { Cell } from "./cell";
import { IPositionStrategy } from "../interfaces/i-position-strategy";
import { PositionDefinition, IPosition } from "./position";
import { CellContext } from "./cell-context";
import { CellBuilder } from "../builders/cell-builder";

export class Board<T extends IIdentible> {
    public cells: Cell<T>[][];
    public elementsMap: { [id: number]: T[] };

    constructor(public size: number,
        private positionStrategy: IPositionStrategy,
        private _identibles: IIdentible[],
        private _cellBuilder: CellBuilder<T>) {
        this.init();
    }

    private init() {
        this.elementsMap = {};
        this._identibles.forEach((identible: IIdentible) => this.elementsMap[identible.id] = []);

        this.cells = [];
        for (let i = 0; i < this.size; i++) {
            this.cells[i] = [];
            for (let j = 0; j < this.size; j++) {
                const position = new PositionDefinition(j, i, 1);
                const cell = this._cellBuilder.build(this.positionStrategy, position);

                if (cell.element && this._identibles.findIndex(cell.element.id) >= 0 && this.elementsMap[cell.element.id]) {
                    this.elementsMap[cell.element.id].push(cell.element);
                }

                this.cells[i].push(cell);
            }
        }
    }

    remove(cellContext: CellContext, removeFromBoard = false): Cell<T> {
        const elements = this.getEementsById(cellContext.playerId);
        const index = this.getElementIndex(cellContext.playerId, cellContext.elementId);
        const cell = this.getCellByPosition(cellContext.position);

        if (removeFromBoard) {
            elements.splice(index, 1);
        }

        cell.element = undefined;

        return cell;
    }

    add(cellContext: CellContext): Cell<T> {
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

    private getElementIndex(id: number, elementId: number): number {
        const elements = this.elementsMap[id];
        const index = elements.findIndex(element => element.id === elementId);

        if (index < 0) {
            throw new Error('element id does not exist');
        }

        return index;
    }

    private getEementsById(id: number): T[] {
        const elements = this.elementsMap[id];

        if (!elements) {
            throw new Error('id does not exist');
        }

        return elements;
    }

    public getCellByPosition(pos: IPosition): Cell<T> {
        return this.cells[pos.y][pos.x];
    }

    public select(predicate: (element: Cell<T>) => boolean): Cell<T>[] {
        return this.cells
            .map((row: Cell<T>[]) => row.filter(predicate))
            .reduce((accumulator: Cell<T>[], currentValue: Cell<T>[]) => {
                accumulator.push(...currentValue);
                return accumulator;
            });
    }
}