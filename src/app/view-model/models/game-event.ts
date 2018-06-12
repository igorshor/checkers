import { PlayerEvent } from "./player-event";
import { GameStage } from "../../model/common/game/game-stage";
export { GameStage };
export class GameEvent {
    constructor(public state: GameStage, public winner?: PlayerEvent, public draw?: boolean) {

    }
}