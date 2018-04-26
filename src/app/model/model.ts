import { Board } from "./models/board/board";
import { CheckersPositionStrategy } from "./models/board/checkers-position-strategy";
import { Player, AiPlayer } from "./models/game/player";
import { Configurations } from "./api/models/game-configurations";
import { IMoveStrategy } from "./models/interfaces/i-move-strategy";
import { MoveValidator } from "./models/move/move-validator";
import { BoundariesValidator } from "./models/move/move-validators/boundaries-validator";
import { DirectionValidator } from "./models/move/move-validators/direction-validator";
import { MoveManager } from "./models/move/move-manager";
import { GameStateManager } from "./models/game/game-state";
import { DistanceValidator } from "./models/move/move-validators/distance-validator";
import { ContextProvider } from "./models/helpers/context-provier";
import { MoveAnalyzer } from "./models/move/move-analyzer";
import { DirectionsDefinition } from "./models/move/move-direction";
import { Checker } from "./models/board/checker";
import { AiMoveManager } from "./models/move/ai/ai-move-manager";
import { IPlayersManager } from "./models/interfaces/i-players-maneger";
import { PlayersManager } from "./models/game/players-manager";
import { CheckrsCellBuilder } from "./models/builders/checkers-cell-builder";

export class Model {
    private _board: Board<Checker>;
    private _playerMoveManeger: IMoveStrategy;
    private _computerMoveManeger: IMoveStrategy;
    private _gameState: GameStateManager;
    private _playersManager: IPlayersManager;

    constructor(configurations: Configurations) {
        this._gameState = new GameStateManager();

        this.setMoveComponents();
        this.setPlayers(configurations);
        this.setBoard(configurations.size);
    }

    private setMoveComponents() {
        this._playersManager = new PlayersManager(this._gameState);
        const moveValidator = new MoveValidator<Checker>()

        moveValidator.append(new BoundariesValidator());
        moveValidator.append(new DirectionValidator());
        moveValidator.append(new DistanceValidator());

        this._playerMoveManeger = new MoveManager(this._board, this._gameState, moveValidator, new MoveAnalyzer(this._board), this._playersManager);
        this._computerMoveManeger = new AiMoveManager(this._board, this._gameState, moveValidator, new MoveAnalyzer(this._board), this._playersManager);
    }

    private setPlayers(configurations: Configurations) {
        const players = [];
        players.push(new Player(configurations.players[0], 1, 1, DirectionsDefinition.Up, this._playerMoveManeger));
        players.push(configurations.computer ?
            new AiPlayer('computer', 2, configurations.size, DirectionsDefinition.Down, this._computerMoveManeger) :
            new Player(configurations.players[1], 2, configurations.size, DirectionsDefinition.Down, this._playerMoveManeger));

        this._playersManager.addPlayer(players[0]);
        this._playersManager.addPlayer(players[1]);
        this._gameState.updateCurrentPlayer(players[0]);
    }

    private setBoard(size: number) {
        this._board = new Board<Checker>(size, new CheckersPositionStrategy(size, this._playersManager), this._playersManager.players, new CheckrsCellBuilder());
    }
}