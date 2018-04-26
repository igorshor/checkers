import { CheckerState } from "./checker-state";
import { IIdentible } from "../interfaces/i-Identible";

export class Checker implements IIdentible {
    public state: CheckerState;
    constructor(public id: any, public selected = false) {
        this.state = CheckerState.Normal;
    }
}