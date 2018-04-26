import { GameStateManager } from "../game/game-state";
import { GameStage } from "../game/game-stage";
import { Player } from "../player/player";
import { PlayersManager } from "../player/players-manager";
import { IIdentible } from "../interfaces/i-Identible";

export class MoveManager<T extends IIdentible> {
    private _currentPlayer: Player;
    private _gameStage: GameStage;

    constructor(private _state: GameStateManager<T>, private _playersManager: PlayersManager<T>) {
        this._state.gameStage.subscribe(stage => this._gameStage = stage);
        this._state.player.first().subscribe(player => this._currentPlayer = player);
    }

    async start(): Promise<void> {
        while (this._gameStage === GameStage.Game) {
             await this._currentPlayer.play();
             this._currentPlayer = this._playersManager.switch();
        }
    }
}