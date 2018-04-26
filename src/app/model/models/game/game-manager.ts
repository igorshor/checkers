import { GameStateManager } from "./game-state";
import { IMoveStrategy } from "../interfaces/i-move-strategy";
import { IPlayersManager } from "../interfaces/i-players-maneger";
import { PositionDefinition } from "../board/position";
import { GameStage } from "./game-stage";
import { Player } from "./player";

export class GameManager {
    private _currentPlayer: Player;
    private _gameStage: GameStage;
    constructor(private _state: GameStateManager, private _playersManager: IPlayersManager) {
        this._state.gameStage.subscribe(stage => this._gameStage = stage);
        this._state.player.subscribe(player => this._currentPlayer = player);
    }

    startNewGame() {
        this.play();
    }

    play() {
        while (this._gameStage === GameStage.Game) {
            this._currentPlayer.
            this._state.updateCurrentPlayer(this._playersManager.switch());
        }
    }

    move(from: PositionDefinition, to: PositionDefinition) {
        this._playersManager.current.move(from, to);
    }
}