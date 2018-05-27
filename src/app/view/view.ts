import './checkers/board/board.component';
import './checkers/checker/checker.component';
import './common/repeater/repeater.component';

import { ViewModel } from '../view-model/view-model';
import { Board } from './checkers/models/board';
import { Builder } from './checkers/builder';
import { Updater } from './checkers/updater';

export class View {
    private _board: Board;
    constructor(private _viewModel: ViewModel) {
        this.addEventListeners();
        this._board = Builder.board(this._viewModel.width, this._viewModel.height);
    }

    private addEventListeners() {
        this._viewModel.board.subscribe(boardEvent => Updater.board(boardEvent, this._board));
        this._viewModel.game.subscribe(gameEvent => Updater.game(gameEvent, this._board));
        this._viewModel.change.subscribe(changeEvent => Updater.change(changeEvent, this._board));
    }
}