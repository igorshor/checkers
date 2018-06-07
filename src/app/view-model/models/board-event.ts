import { CheckerEvent } from "./checker-event";

export class BoardEvent {
    constructor(public cells: CheckerEvent[][], public width: number, public height: number) { }

    get flatCells(): CheckerEvent[] {
        return this.cells.reduce((prevValue, curValue) => {
            prevValue.push(...curValue);
            return prevValue;
        }, []);
    }
}