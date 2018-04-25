import { DirectionsDefinition } from "../move/move-direction";
import { IMoveStrategy } from "../interfaces/i-move-strategy";
import { PositionDefinition } from "../board/position";

export class Player {
    constructor(public name: string, public id: any, public base: number, public direction: DirectionsDefinition, private _moveManager: IMoveStrategy) {

    }

    move(from:PositionDefinition, to:PositionDefinition){
        this._moveManager.move(from, to);
    }
}

export class AiPlayer extends Player {
    constructor(name: string, id: any, base: number, direction: DirectionsDefinition, _moveManager: IMoveStrategy) {
        super(name, id, base, direction, _moveManager);
    }
}