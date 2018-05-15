import { DirectionsDefinition } from "../move/move-direction";
import { IMoveStrategy } from "../interfaces/i-move-strategy";
import { PositionDefinition } from "../board/position";
import { IIdentible } from "../interfaces/i-Identible";
import { Cell } from "../board/cell";

export class Player<T extends IIdentible> implements IIdentible {
    constructor(public name: string,
        public id: any,
        public base: number,
        public direction: DirectionsDefinition,
        private _moveStrategy: IMoveStrategy<T>) {

    }

    async play(): Promise<Cell<T>[]> {
        return this._moveStrategy.play();
    }
}

export class AiPlayer<T extends IIdentible> extends Player<T> {
    constructor(name: string, id: any, base: number, direction: DirectionsDefinition, _moveManager: IMoveStrategy<T>) {
        super(name, id, base, direction, _moveManager);
    }
}