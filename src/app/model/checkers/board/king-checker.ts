import { Checker } from "./checker";
import { IKingMaker } from "./checkers-builder";
import { DirectionsDefinition } from "../../common/move/move-direction";

export class KingChecker extends Checker {
    public static attackDirections = [DirectionsDefinition.Down, DirectionsDefinition.Up];
    constructor(private _checker: Checker, kingMaker: IKingMaker) {
        super(_checker.id, _checker.correlationId, KingChecker.attackDirections, _checker.position, kingMaker, _checker.selected);
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
}