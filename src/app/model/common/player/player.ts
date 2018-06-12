import { DirectionsDefinition } from "../move/move-direction";
import { IMoveStrategy } from "../interfaces/i-move-strategy";
import { IIdentible } from "../interfaces/i-Identible";
import { Cell } from "../board/cell";

export class Player<T extends IIdentible> implements IIdentible {
    constructor(public name: string,
        public id: any,
        public publicId: string,
        public base: number,
        public direction: DirectionsDefinition,
        private _moveStrategy: IMoveStrategy<T>) {

    }

    async play(): Promise<Cell<T>[]> {
        // tslint:disable-next-line:no-return-await
        return await this._moveStrategy.play();
    }
}

export class AiPlayer<T extends IIdentible> extends Player<T> {
    constructor(name: string, id: any, publicId: string, base: number, direction: DirectionsDefinition, _moveManager: IMoveStrategy<T>) {
        super(name, id, publicId, base, direction, _moveManager);
    }
}