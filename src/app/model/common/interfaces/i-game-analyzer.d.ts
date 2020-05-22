import { IIdentible } from "./i-Identible";
import { GameState } from "../game/game-state";
import { Cell } from "../board/cell";
import { Player } from "../player/player";

export interface IGameAnalyzer<T extends IIdentible> {
    getGameState(): GameState;
    checkForMovableComponents(player: Player<T>): Cell<T>[]
}