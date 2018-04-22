import { Board } from "./models/board/board";
import { CheckersPositionStrategy } from "./models/board/checkers-position-strategy";
import { Player, AiPlayer } from "./models/game/player";
import { Configurations } from "./api/models/game-configurations";
import { IMoveStrategy } from "./models/interfaces/i-move-strategy";
import { MoveValidator } from "./models/move/move-validator";
import { BoundariesValidator } from "./models/move/move-validators/boundaries-validator";
import { DirectionValidator } from "./models/move/move-validators/direction-validator";
import { MoveManeger } from "./models/move/move-maneger";
import { GameStateManeger } from "./models/game/game-state";
import { DistanceValidator } from "./models/move/move-validators/distance-validator";

export class Model {
    private _board: Board;
    private _moveManeger: IMoveStrategy;
    private _gameState: GameStateManeger;
    private _players: Player[];

    constructor(configurations: Configurations) {
        this._gameState = new GameStateManeger();
        this.setPlayers(configurations);
        this.setBoard(configurations.size);
        this.setMoveComponents();
    }

    private setPlayers(configurations: Configurations) {
        this._players = [];
        this._players.push(new Player(configurations.players[0], 1, 1));
        this._players.push(configurations.computer ?
            new AiPlayer('computer', 2, configurations.size) :
            new Player(configurations.players[1], 2, configurations.size));

        this._gameState.updateCurrentPlayer(this._players[0]);
    }

    private setBoard(size: number) {
        this._board = new Board(size, new CheckersPositionStrategy(size, this._players));
    }

    private setMoveComponents() {
        const moveValidator = new MoveValidator()

        moveValidator.append(new BoundariesValidator());
        moveValidator.append(new DirectionValidator());
        moveValidator.append(new DistanceValidator());

        this._moveManeger = new MoveManeger(this._board, this._gameState, moveValidator);
    }
}