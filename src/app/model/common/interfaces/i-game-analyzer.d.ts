import { IIdentible } from "./i-Identible";
import { GameState } from "../game/game-state";

export interface IGameAnalyzer<T extends IIdentible> {
    getGameState(): GameState;
}