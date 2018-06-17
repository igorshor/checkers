import { IIdentible } from "../interfaces/i-Identible";
import { Cell } from "./cell";
import { IPositionStrategy } from "../interfaces/i-position-strategy";
import { IPosition } from "./position";
import { SelectionContext } from "./selection-context";
import { CellBuilder } from "../builders/cell-builder";
import { Player } from "../player/player";

export class Board<T extends IIdentible> {
    private _cells: Cell<T>[][];
    private _players: Player<T>[];
    public elementsMap: { [id: string]: T[] };

    constructor(public readonly width: number, public readonly height: number,
        private positionStrategy: IPositionStrategy<T>,
        private _cellBuilder: CellBuilder<T>, identibles?: Player<T>[]) {
        if (identibles) {
            this._players = identibles;
        }
    }

    get cells(): Cell<T>[][] {
        return this._cells;
    }

    get immutableCells(): Cell<T>[][] {
        const cells: Cell<T>[][] = [];

        for (let i = 0; i < this.height; i++) {
            cells[i] = [];
            for (let j = 0; j < this.width; j++) {
                cells[i][j] = this.cells[i][j].mutateObject();
            }
        }

        return cells;
    }

    get immutablePlayers(): Player<T>[] {
        return this._players.map(player => player.mutateObject());
    }

    get immutableBoard(): Board<T> {
        const board = new Board<T>(this.width, this.height, this.positionStrategy, this._cellBuilder, this._players);
        board.restore(this.immutableCells, this.immutablePlayers);

        return board;
    }

    restore(cells: Cell<T>[][], players: Player<T>[]) {
        this._cells = cells;
        this._players = players;
        this.calculateElementsMap();
    }

    private calculateElementsMap() {
        this.initElementsMap();

        this._cells.forEach(row => row.forEach(cell => this.tryToAddElementToElementsMap(cell)))
    }

    private initElementsMap() {
        this.elementsMap = {};
        this._players.forEach((identible: IIdentible) => this.elementsMap[identible.id] = []);
    }

    private tryToAddElementToElementsMap(cell: Cell<T>) {
        if (cell.element && this.elementsMap[cell.element.associatedId]) {
            this.elementsMap[cell.element.associatedId].push(cell.element);
        }
    }

    public init(players: Player<T>[]) {
        this._players = players;
        this.initElementsMap();
        this._cells = [];

        for (let i = 0; i < this.height; i++) {
            this._cells[i] = [];

            for (let j = 0; j < this.width; j++) {
                const position = { x: j, y: i };
                const cell = this._cellBuilder.build(this.positionStrategy, this._players, position);

                this.tryToAddElementToElementsMap(cell);
                this._cells[i].push(cell);
            }
        }
    }

    remove(cellContext: SelectionContext, removeFromBoard = false): Cell<T> {
        const elements = this.getPlayerEementsByPlayerId(cellContext.playerId);
        const index = this.getElementIndex(cellContext.playerId, cellContext.elementId);
        const cell = this.getCellByPosition(cellContext.position);

        if (removeFromBoard) {
            elements.splice(index, 1);
        }

        cell.element = undefined;

        return cell;
    }

    add(cellContext: SelectionContext): Cell<T> {
        const elements = this.getPlayerEementsByPlayerId(cellContext.playerId);
        const index = this.getElementIndex(cellContext.playerId, cellContext.elementId);
        const element = elements[index];
        const cell = this.getCellByPosition(cellContext.position);

        if (cell.element) {
            throw new Error('cell allready have an element');
        }

        cell.element = element;

        return cell;
    }

    private getElementIndex(playerId: string, elementId: number): number {
        const elements = this.elementsMap[playerId];
        const index = elements.findIndex(element => element.id === elementId);

        if (index < 0) {
            throw new Error('element id does not exist');
        }

        return index;
    }

    public getElement(playerId: string, elementId: number): T {
        const index = this.getElementIndex(playerId, elementId);

        return this.elementsMap[playerId][index];
    }

    private getPlayerEementsByPlayerId(id: string): T[] {
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