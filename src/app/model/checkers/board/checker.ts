import { CheckerState } from "./checker-state";
import { IIdentible } from "../../common/interfaces/i-Identible";

export class Checker implements IIdentible {
    public state: CheckerState;
    constructor(public id: any, public selected = false) {
        this.state = CheckerState.Normal;
    }
}