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
        public boardSize: number,
        private _kingMaker: IKingMaker,
        public selected = false) {
    }

    public upgradeToKing(): Checker {
        return this._kingMaker.createKingElement(this);
    }

    public downgradeToPeasant(): Checker {
        throw new Error('already a peasant :o');
    }

    get possibleNextMovePositions(): IPosition[] {
        return this.getPossibleNextMovePositions(this.direction, 2);
    }

    protected getPossibleNextMovePositions(attackDirection: DirectionsDefinition, moves: number): IPosition[] {
        return Checker.possibleDirections
            .map((moveDirection) => this.nextPositions(attackDirection | moveDirection, moves))
            .reduce((acc, val) => acc.concat(val), []);
    }

    protected nextPositions(moveDirection: MoveDirectionsDefinition, moves: number): IPosition[] {
        const positions: IPosition[] = [];
        let pos = this.associatedPosition;
        const maxMoves = MoveHelper
            .getMaxPossibleNextMovePositionsCount(moveDirection, this.associatedPosition, this.boardSize, moves);

        for (let i = 0; i < maxMoves; i++) {
            pos = MoveHelper.simulateNextCellByDirection(pos, moveDirection);
            positions.push(pos);
        }

        return positions;
    }

    get isKing(): boolean {
        return false;
    }
    get isPeasant(): boolean {
        return true;
    }

    mutateObject() {
        return new Checker(this.id, this.associatedId, this.direction, this.associatedPosition, this.boardSize, this._kingMaker, this.selected);
    }
}