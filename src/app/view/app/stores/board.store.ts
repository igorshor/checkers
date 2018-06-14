import { observable, computed, reaction, action } from 'mobx';
import { Cell } from '../../models/cell.model';
import { Board } from '../../models/board.model';
import { BoardEvent } from '../../../view-model/models/board-event';
import { CheckerEvent } from '../../../view-model/models/checker-event';
import { ChangeEvent } from '../../../view-model/models/change-event';
import { ViewModel } from '../../../view-model/view-model';
import { PositionType } from '../../../model/common/board/position-type';
import { IPosition } from '../../../model/common/board/position';

export class BoardStore {
    @observable board: Board;

    constructor(private vm: ViewModel) {
        this.init();

        vm.board.subscribe((boardEvent: BoardEvent) => {
            this.updateCells(boardEvent.flatCells);
        });

        vm.change.subscribe((changeEvent: ChangeEvent) => {
            this.updateCells(changeEvent.items);
        });
    }

    private updateCells(checkerEvents: CheckerEvent[]) {
        checkerEvents.forEach(this.updateCell);
    }

    @action.bound
    private updateCell(checkerEvent: CheckerEvent) {
        const cell = {
            ...this.board.cells[checkerEvent.position.y][checkerEvent.position.x],
            playerId: checkerEvent.playerId ? checkerEvent.playerId.toString() : undefined,
            type: checkerEvent.type,
            prediction: checkerEvent.prediction,
            superMode: checkerEvent.superMode,
            selected: checkerEvent.selected
        };

        const cellRow = [
            ...this.board.cells[checkerEvent.position.y].slice(0, checkerEvent.position.x),
            cell,
            ...this.board.cells[checkerEvent.position.y].slice(checkerEvent.position.x + 1)
        ];

        const immutableCells = [
            ...this.board.cells.slice(0, checkerEvent.position.y),
            cellRow,
            ...this.board.cells.slice(checkerEvent.position.y + 1)
        ];

        this.board = { ...this.board, cells: immutableCells as Cell[][] };
    }

    @action
    private init() {
        this.board = this.initBoard();
    }

    public getCell(position: IPosition): Cell {
        return this.board.cells[position.y][position.x];
    }

    private initBoard(): Board {
        const flatCells = [];
        const cells: Cell[][] = new Array(this.vm.height).fill([]);

        for (let i = 0; i < this.vm.height; i++) {
            cells[i] = [];
            for (let j = 0; j < this.vm.width; j++) {
                const cell = {
                    id: (i * 10) + (j + 1) + '',
                    type: (i + j) % 2 === 0 ? PositionType.Black : PositionType.White,
                    position: { y: i, x: j }
                };

                cells[i][j] = cell;
                flatCells.push(cell);
            }
        }

        return { cells };
    }
}