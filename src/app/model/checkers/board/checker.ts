import { IIdentible } from "../../common/interfaces/i-Identible";
import { DirectionsDefinition, MoveDirectionsDefinition } from "../../common/move/move-direction";
import { IKingMaker } from "./checkers-builder";
import { IPosition } from "../../common/board/position";

export class Checker implements IIdentible {
    public static possibleDirections = [DirectionsDefinition.Left, DirectionsDefinition.Right];
    constructor(public id: number,
        public correlationId: string,
        public directions: DirectionsDefinition[],
        public position: IPosition,
        private _kingMaker: IKingMaker,
        public selected = false,
        public movable = false) {
    }

    public upgradeToKing(): Checker {
        return this._kingMaker.createKingElement(this);
    }

    public downgradeToPeasant(): Checker {
        throw new Error('already a peasant :o')
    }

    get isKing(): boolean {
        return false;
    }

    get isPeasant(): boolean {
        return true;
    }

    mutate(): Checker {
        return new Checker(this.id, this.correlationId, this.directions, this.position, this._kingMaker, this.selected, this.movable) as this;
    }
}