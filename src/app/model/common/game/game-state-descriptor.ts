import { GameStage } from "./game-stage";

export class GameStateDescriptor {
    constructor(public gameStage: GameStage = GameStage.Init) {

    }
}