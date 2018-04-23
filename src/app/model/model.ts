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

export class Model {
    private _board: Board;
    private _moveManeger: IMoveStrategy;
    private _gameState: GameStateManager;
    private _players: Player[];

    constructor(configurations: Configurations) {
        this._gameState = new GameStateManager();
        this.setPlayers(configurations);
        this.setBoard(configurations.size);
        this.setMoveComponents();
    }

    private setPlayers(configurations: Configurations) {
        this._players = [];
        this._players.push(new Player(configurations.players[0], 1, 1, DirectionsDefinition.Up));
        this._players.push(configurations.computer ?
            new AiPlayer('computer', 2, configurations.size, DirectionsDefinition.Down) :
            new Player(configurations.players[1], 2, configurations.size, DirectionsDefinition.Down));

        this._gameState.updateCurrentPlayer(this._players[0]);
    }

    private setBoard(size: number) {
        this._board = new Board(size, new CheckersPositionStrategy(size, this._players), new ContextProvider(this._gameState));
    }

    private setMoveComponents() {
        const moveValidator = new MoveValidator()

        moveValidator.append(new BoundariesValidator());
        moveValidator.append(new DirectionValidator());
        moveValidator.append(new DistanceValidator());

        this._moveManeger = new MoveManager(this._board, this._gameState, moveValidator, new MoveAnalyzer(this._board));
    }
}