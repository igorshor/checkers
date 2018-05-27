import { Model } from "../model";
import { View } from "../view";

import { Configurations } from "../model/models/game-configurations";
import { ViewModel } from "./view-model";

export class Controller {
    public viewModel: ViewModel;
    constructor(private _model: Model) {
        this.viewModel = new ViewModel(_model.gameState);
    }

    public set(configurations: Configurations): void {
        this._model.init(configurations);
    }

    public start(): void {
        this._model.start();
    }
}