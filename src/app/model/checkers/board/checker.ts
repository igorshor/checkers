import { CheckerState } from "./checker-state";
import { IIdentible } from "../../common/interfaces/i-Identible";

export class Checker implements IIdentible {
    constructor(public id: number, public associatedId: string, public selected = false, public state = CheckerState.Normal) {

    }

    public makeAKing(): void {
        this.state = CheckerState.King;
    }

    public becomeAPeasant(): void {
        this.state = CheckerState.Normal;
    }

    get isKing(): boolean {
        return this.state === CheckerState.King;
    }
    get isPeasant(): boolean {
        return this.state === CheckerState.Normal;
    }
}