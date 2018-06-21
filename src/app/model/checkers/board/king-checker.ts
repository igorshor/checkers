import { Checker } from "./checker";

export class KingChecker extends Checker {
    constructor(private _checker: Checker) {
        super(_checker.id, _checker.associatedId, _checker.direction, _checker.selected);

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