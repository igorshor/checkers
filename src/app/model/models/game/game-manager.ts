import { GameStateManager } from "./game-state";
import { IMoveStrategy } from "../interfaces/i-move-strategy";
import { IPlayersManager } from "../interfaces/i-players-maneger";
import { PositionDefinition } from "../board/position";

export class GameManager {
    constructor(private _state: GameStateManager, private _moveManager: IMoveStrategy, private playersManager: IPlayersManager) { }

    startNewGame() {

    }

    move(from:PositionDefinition, to:PositionDefinition){
        this._moveManager.move(from, to);
    }
}