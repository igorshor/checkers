import { observable, computed, reaction, action } from 'mobx';
import { Board } from '../../models/board.model';
import { ViewModel } from '../../../view-model';
import { Cell } from '../../models/cell.model';
import { BoardEvent } from '../../../view-model/models/board-event';
import { CheckerEvent } from '../../../view-model/models/checker-event';
import { ChangeEvent } from '../../../view-model/models/change-event';

export class BoardStore {
    @observable board: Board;

    constructor(private _viewModel: ViewModel) {
        this.init();

        _viewModel.board.subscribe((boardEvent: BoardEvent) => {
            this.updateCells(boardEvent.flatCells);
        });

        _viewModel.change.subscribe((changeEvent: ChangeEvent) => {
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
        this.board = {
            cells: this.initCells()
        };
    }

    private initCells(): Cell[][] {
        const cells: Cell[][] = new Array(this._viewModel.height).fill([]);
        for (let i = 0; i < this._viewModel.height; i++) {
            for (let j = 0; j < this._viewModel.width; j++) {
                cells[i][j] = {
                    position: { y: i, x: j }
                };
            }
        }

        return cells;
    }
}