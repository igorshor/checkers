import { PlayerEvent } from "./player-event";
import { GameStage } from "../common/game/game-stage";

export class GameEvent {
    constructor(public state: GameStage, public winner?: PlayerEvent, public draw?: boolean) {

    }
}