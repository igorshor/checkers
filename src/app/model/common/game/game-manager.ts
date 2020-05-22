import { Player } from "../player/player";
import { GameStage } from "./game-stage";
import { GameStateManager } from "./game-state-manager";
import { MoveManager } from "../move/move-manager";
import { IIdentible } from "../interfaces/i-Identible";
import { PlayersManager } from "../player/players-manager";
import { IGameAnalyzer } from "../interfaces/i-game-analyzer";
import { GameState } from "./game-state";
import { GameStateDescriptor } from "./game-state-descriptor";
import { IMoveAnalyzer } from "../interfaces/i-move-analyzer";
import { Board } from "../board/board";


export class GameManager<T extends IIdentible> {
    private _gameStage: GameStage;
    private _gameState: GameState;

    constructor(private _state: GameStateManager<T>,
        private _playersManager: PlayersManager<T>,
        private _moveManager: MoveManager<T>,
        private _gameAnalyzer: IGameAnalyzer<T>) {
        this._state.beforePlayerChanged.subscribe(() => this.checkGameStateBeforeContinue());
        this._state.currentPlayer.subscribe((player: Player<T>) => {
            
            const movableComponents = this._gameAnalyzer.checkForMovableComponents(player);

            this._state.updateCells(movableComponents)
        });
    }

    startNewGame() {
        this._state.updateGameState(new GameStateDescriptor<T>(GameStage.Game));
        this._moveManager.start();
    }

    private checkGameStateBeforeContinue() {
        this._gameState = this._gameAnalyzer.getGameState();

        if (this._gameState === GameState.Game) {
            return;
        }

        const result = new GameStateDescriptor<T>(GameStage.Finish);

        if (this._gameState === GameState.Winner) {
            result.winner = this._playersManager.current;
        } else if (this._gameState === GameState.Draw) {
            result.draw = true;
        }

        this._state.updateGameState(result);
    }
}