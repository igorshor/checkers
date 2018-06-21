import { IIdentible } from "../../common/interfaces/i-Identible";
import { DirectionsDefinition, MoveDirectionsDefinition } from "../../common/move/move-direction";
import { IKingMaker } from "./checkers-builder";
import { IPosition } from "../../common/board/position";
import { MoveHelper } from "../move/move-helper";

export class Checker implements IIdentible {
    public static possibleDirections = [DirectionsDefinition.Left, DirectionsDefinition.Right];
    constructor(public id: number,
        public associatedId: string,
        public direction: DirectionsDefinition,
        public associatedPosition: IPosition,
        private _kingMaker: IKingMaker,
        public selected = false) {
    }

    public upgradeToKing(): Checker {
        return this._kingMaker.createKingElement(this);
    }

    public downgradeToPeasant(): Checker {
        throw new Error('already a peasant :o')
    }

    get possibleNextMovePositions(): IPosition[] {
        return Checker.possibleDirections.map((moveDirection) => MoveHelper.simulateNextCellByDirection(this.associatedPosition, this.direction | moveDirection))
    }

    get isKing(): boolean {
        return false;
    }
    get isPeasant(): boolean {
        return true;
    }
}