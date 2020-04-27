import { Checker } from "./checker";
import { IKingMaker } from "./checkers-builder";
import { DirectionsDefinition } from "../../common/move/move-direction";
import { IPosition } from "../../common/board/position";
import { MoveHelper } from "../move/move-helper";

export class KingChecker extends Checker {
    public static attackDirections = [DirectionsDefinition.Down, DirectionsDefinition.Up];
    constructor(private _checker: Checker, kingMaker: IKingMaker) {
        super(_checker.id, _checker.playerId, _checker.direction, _checker.position, kingMaker, _checker.selected);

    }

    public upgradeToKing(): Checker {
        throw new Error('already a king :>')
    }

    public downgradeToPeasant(): Checker {
        return this._checker;
    }

    get isKing(): boolean {
        return true;
    }
    get isPeasant(): boolean {
        return false;
    }

    get possibleNextMovePositions(): IPosition[] {
        return KingChecker
            .attackDirections
            .map(direction => Checker
                .possibleDirections
                .map(moveDirection => MoveHelper.simulateNextCellByDirection(this.position, direction | moveDirection)))
            .reduce((acc, val) => acc.concat(val), []);
    }
}