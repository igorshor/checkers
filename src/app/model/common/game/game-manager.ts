import { Player } from "../player/player";
import { GameStage } from "./game-stage";
import { GameStateManager } from "./game-state-manager";
import { MoveManager } from "../move/move-manager";
import { IIdentible } from "../interfaces/i-Identible";
import { PlayersManager } from "../player/players-manager";
import { IGameAnalyzer } from "../interfaces/i-game-analyzer";
import { GameState } from "./game-state";
import { GameStateDescriptor } from "./game-state-descriptor";


export class GameManager<T extends IIdentible> {
    private _currentPlayer: Player<T>;
    private _gameStage: GameStage;
    private _gameState: GameState;

    constructor(private _state: GameStateManager<T>,
        private _playersManager: PlayersManager<T>,
        private _moveManager: MoveManager<T>,
        private _gameAnalyzer: IGameAnalyzer<T>) {
        this._state.beforePlayerChanged.subscribe(() => {
            this._gameState = this._gameAnalyzer.getGameState();

            if (this._gameState === GameState.Game) {
                return;
            }

            const result = new GameStateDescriptor(GameStage.Finish);
            this._state.updateGameState(result);
        });
    }

    startNewGame() {
        this._state.currentPlayer.subscribe(player => this._currentPlayer = player);
        this._moveManager.start();
    }
}