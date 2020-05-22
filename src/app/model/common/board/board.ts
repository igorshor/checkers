import { IIdentible } from "../interfaces/i-Identible";
import { Cell } from "./cell";
import { IPositionStrategy } from "../interfaces/i-position-strategy";
import { IPosition } from "./position";
import { SelectionContext } from "./selection-context";
import { CellBuilder } from "../builders/cell-builder";
import { Player } from "../player/player";

const NOOP = (...args:any[]) => {};

export class Board<T extends IIdentible> {
    private _cells: Cell<T>[][];
    private _players: Player<T>[];
    public elementsMap: { [id: string]: T[] };
    public _removed: T[];

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
        return this._players.map(player => player.mutate());
    }

    get immutableBoard(): Board<T> {
        const board = new Board<T>(this.width, this.height, this.positionStrategy, this._cellBuilder, this._players);
        board.restore(this.immutableCells, this.immutablePlayers);

        return board;
    }

    restoreFromImage(cells: IIdentible[][], players: Player<T>[]) {
        this.cellIterator(NOOP, (pos: IPosition) => {
            const cellImage = cells[pos.y][pos.x]
            const cell = this._cellBuilder.buildFromImage(cellImage, this.positionStrategy);
            this.tryToAddElementToElementsMap(cell);
            this._cells[pos.y][pos.x] = cell;
        }, true)


        this.restore(this._cells, this._players);
    }

    restore(cells: Cell<T>[][], players: Player<T>[]) {
        this._cells = cells;
        this._players = players;
        this.calculateElementsMap();
    }

    private calculateElementsMap() {
        this.initElementsMap();

        this._cells.forEach(row => row.forEach(cell => this.tryToAddElementToElementsMap(cell)));
    }

    private initElementsMap() {
        this.elementsMap = {};
        this._players.forEach((identible: IIdentible) => this.elementsMap[identible.id] = []);
    }

    private tryToAddElementToElementsMap(cell: Cell<T>) {
        if (cell.element && this.elementsMap[cell.element.correlationId]) {
            this.elementsMap[cell.element.correlationId].push(cell.element);
        }
    }

    private cellIterator(rowFunc: (x: number) => void, cellFunc: (pos: IPosition) => void, init?: boolean) {
        if (init) {
            this._cells = [];
        }

        for (let i = 0; i < this.height; i++) {
            if (init) {
                this._cells[i] = []
            }

            rowFunc(i);
            for (let j = 0; j < this.width; j++) {
                const position = { x: j, y: i };
                cellFunc(position);
            }
        }
    }

    public init(players: Player<T>[]) {
        this._players = players;
        this.initElementsMap();

        this.cellIterator(NOOP, (pos: IPosition) => {
            const cell = this._cellBuilder.build(this.positionStrategy, this._players, pos);

            this.tryToAddElementToElementsMap(cell);
            this._cells[pos.y].push(cell);
        }, true)
    }

    replace(cellContext: SelectionContext, newElement:T): Cell<T> {
        const cell = this.getCellByPosition(cellContext.position);
        cell.element = newElement;

        return cell;
    }

    remove(cellContext: SelectionContext, removeFromBoard = false): Cell<T> {
        const cell = this.getCellByPosition(cellContext.position);

        if (removeFromBoard) {
            this.removeElement(cellContext.playerId, cellContext.elementId);
        }

        cell.element = undefined;

        return cell;
    }

    private removeElement(playerId: string, elementId: number) {
        this._removed = this._removed || [];

        const index = this.getElementIndex(playerId, elementId);
        const elements = this.getPlayerEementsByPlayerId(playerId);
        const removedElement = elements.splice(index, 1);

        this._removed.push(removedElement[0]);
    }

    private restoreElement(playerId: string, elementId: number) {
        this._removed = this._removed || [];

        const elements = this.getPlayerEementsByPlayerId(playerId);
        const index = this._removed.findIndex(element => element.id === elementId);
        const removedElement = this._removed.splice(index, 1);

        elements.push(removedElement[0]);
    }

    add(cellContext: SelectionContext, addToBoard = false): Cell<T> {
        if (addToBoard) {
            this.restoreElement(cellContext.playerId, cellContext.elementId);
        }

        const elements = this.getPlayerEementsByPlayerId(cellContext.playerId);
        const index = this.getElementIndex(cellContext.playerId, cellContext.elementId);
        const element = elements[index];
        const cell = this.getCellByPosition(cellContext.position);

        if (cell.element) {
            throw new Error('cell allready have an element');
        }

        cell.element = element;
        element.position = cell.position;

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
            .reduce((accumulator: Cell<T>[], currentValue: Cell<T>[]) => accumulator.concat(...currentValue));
    }

    toString() {
        let boardStr = '';
        const playersStr = 'x = ' + this._players[0].name + ' | y = ' + this._players[1].name;
        const headerRow = '  ' + this._cells[0].map((_, index) => index).join(' ') + '\n'
        const rowsStr = this._cells.reverse().map((row, index) => {
            let rowStr = index + `|`;
            const rowCellsStr = row.map(cell => {
                if (!cell.element) {
                    return ' ';
                } else {
                    return cell.element.correlationId === this._players[0].id ? 'x' : 'y';
                }
            });

            rowStr += rowCellsStr.join('|');
            rowStr += '|';

            return rowStr;
        });

        boardStr += headerRow + rowsStr.join('\n');

        return '\n' + playersStr + '\n\n' + boardStr + '\n';
    }
}