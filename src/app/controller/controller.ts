import { Model } from "../model";
import { View } from "../view";

import { Configurations } from "../model/models/game-configurations";

export class Controller {
    constructor(private _model: Model, private _vire: View) {

    }

    public set(configurations: Configurations): void {
        this._model.init(configurations);
    }

    public start(): void {
        this._model.start();
    }
}