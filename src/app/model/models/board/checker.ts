import { CheckerState } from "./checker-state";

export class Checker {
    public state: CheckerState;
    constructor(public id: any) {
        this.state = id ? CheckerState.Game : CheckerState.Dead;
    }
}