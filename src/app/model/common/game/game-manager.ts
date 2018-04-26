import { Player } from "../player/player";
import { GameStage } from "./game-stage";
import { GameStateManager } from "./game-state";
import { MoveManager } from "../move/move-manager";
import { IIdentible } from "../interfaces/i-Identible";
import { PlayersManager } from "../player/players-manager";


export class GameManager<T extends IIdentible> {
    private _currentPlayer: Player;
    private _gameStage: GameStage;
    constructor(private _state: GameStateManager<T>, private _playersManager: PlayersManager<T>, private _moveManager: MoveManager<T>) {
        this._state.gameStage.subscribe(stage => this._gameStage = stage);
    }

    startNewGame() {
        this._state.player.subscribe(player => this._currentPlayer = player);
        this._moveManager.start();
    }
}