import { GameStage } from "./game-stage";
import { IIdentible } from "../interfaces/i-Identible";
import { Player } from "../player/player";

export class GameStateDescriptor<T extends IIdentible> {
    public winner: Player<T>;
    public draw: boolean;
    constructor(public gameStage: GameStage = GameStage.Init) {
        this.draw = false;
    }
}