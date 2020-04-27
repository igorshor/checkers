import { CheckerEvent } from "./checker-event";

export class ChangeEvent {
    constructor(public items: CheckerEvent[]) {
    }
}