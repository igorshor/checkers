import { GameStateManager } from "./game-state";
import { IMoveStrategy } from "../interfaces/i-move-strategy";
import { IPlayersManager } from "../interfaces/i-players-maneger";
import { PositionDefinition } from "../board/position";

export class GameManager {
    constructor(private _state: GameStateManager, private _playersManager: IPlayersManager) { }

    startNewGame() {

    }

    move(from:PositionDefinition, to:PositionDefinition){
        this._playersManager.current.move(from, to);
    }
}