import { DirectionsDefinition } from "../move/move-direction";
import { IMoveStrategy } from "../interfaces/i-move-strategy";
import { IIdentible } from "../interfaces/i-Identible";
import { Cell } from "../board/cell";

export class Player<T extends IIdentible> implements IIdentible {
    constructor(public name: string,
        public id: string,
        public base: number,
        public direction: DirectionsDefinition,
        private _moveStrategy: IMoveStrategy<T>) {

    }

    async play(): Promise<Cell<T>[]> {
        // tslint:disable-next-line:no-return-await
        return await this._moveStrategy.play();
    }

    public mutateObject(): Player<T> {
        return new Player<T>(this.name, this.id, this.base, this.direction, this._moveStrategy);
    }
}

export class AiPlayer<T extends IIdentible> extends Player<T> {
    constructor(name: string, id: string, base: number, direction: DirectionsDefinition, _moveManager: IMoveStrategy<T>) {
        super(name, id, base, direction, _moveManager);
    }
}