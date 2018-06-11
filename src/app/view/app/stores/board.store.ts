import { observable, computed, reaction, action } from 'mobx';
import { Cell } from '../../models/cell.model';
import { Board } from '../../models/board.model';
import { BoardEvent } from '../../../view-model/models/board-event';
import { CheckerEvent } from '../../../view-model/models/checker-event';
import { ChangeEvent } from '../../../view-model/models/change-event';
import { CellType } from '../../models/cell-type.model';
import { ViewModel } from '../../../view-model/view-model';

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

    @action
    private updateCell(checkerEvent: CheckerEvent) {
        const cell = this.board.cells[checkerEvent.position.y][checkerEvent.position.y];
        cell.playerId = checkerEvent.playerId;
    }

    @action
    private init() {
        this.board = this.initBoard();
    }

    private initBoard(): Board {
        const flatCells = [];
        const cells: Cell[][] = new Array(this.vm.height).fill([]);

        for (let i = 0; i < this.vm.height; i++) {
            cells[i] = [];
            for (let j = 0; j < this.vm.width; j++) {
                const cell = {
                    id: (i * 10) + (j + 1) + '',
                    type: (i + j) % 2 === 0 ? CellType.Black : CellType.White,
                    position: { y: i, x: j }
                };

                cells[i][j] = cell;
                flatCells.push(cell);
            }
        }

        return { cells, flatCells };
    }
}