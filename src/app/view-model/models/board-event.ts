import { CheckerEvent } from "./checker-event";

export class BoardEvent {
    constructor(public cells: CheckerEvent[][], public width: number, public height: number) { }
}