import './checkers/board/board.component';
import './checkers/checker/checker.component';
import './common/repeater/repeater.component';
import { Controller } from '../view-model';
import { ViewModel } from '../view-model/view-model';
export class View {
    private _viewModel: ViewModel;
    constructor(private _controller: Controller) {
        this._viewModel = this._controller.viewModel;
    }
}