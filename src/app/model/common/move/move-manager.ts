import { GameStateManager } from "../game/game-state-manager";
import { GameStage } from "../game/game-stage";
import { Player } from "../player/player";
import { PlayersManager } from "../player/players-manager";
import { IIdentible } from "../interfaces/i-Identible";

export class MoveManager<T extends IIdentible> {
    private _currentPlayer: Player<T>;
    private _gameStage: GameStage;

    constructor(private _state: GameStateManager<T>, private _playersManager: PlayersManager<T>) {
        this._state.gameStage.subscribe(stageDescriptor => this._gameStage = stageDescriptor.gameStage);
    }

    async start(): Promise<void> {
        while (this._gameStage === GameStage.Game) {
             const changes = await this._playersManager.current.play();
             this._state.updateCells(changes);
             this._currentPlayer = this._playersManager.switch();
        }
    }
}