import { GameStateManager } from "./game-state";
import { IMoveStrategy } from "../interfaces/i-move-strategy";
import { IPlayersManager } from "../interfaces/i-players-maneger";
import { PositionDefinition } from "../board/position";
import { GameStage } from "./game-stage";
import { Player } from "./player";
import { MoveManager } from "../move/move-manager";

export class GameManager {
    private _currentPlayer: Player;
    private _gameStage: GameStage;
    constructor(private _state: GameStateManager, private _playersManager: IPlayersManager, private _moveManager: MoveManager) {
        this._state.gameStage.subscribe(stage => this._gameStage = stage);
    }

    startNewGame() {
        this._state.player.subscribe(player => this._currentPlayer = player);
        this._moveManager.start();
    }
}