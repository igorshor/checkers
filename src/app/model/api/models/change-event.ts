import { CheckerEvent } from "./checker-event";
import { PlayerEvent } from "./player-event";

export class ChangeEvent {
    constructor(public playerId: PlayerEvent, public items: CheckerEvent[]) {
    }
}