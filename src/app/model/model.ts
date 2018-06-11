import { Board } from "./common/board/board";
import { Checker } from "./checkers/board/checker";
import { IMoveStrategy } from "./common/interfaces/i-move-strategy";
import { GameStateManager } from "./common/game/game-state-manager";
import { PlayersManager } from "./common/player/players-manager";
import { GameManager } from "./common/game/game-manager";
import { MoveManager } from "./common/move/move-manager";
import { Configurations } from "./models/game-configurations";
import { MoveValidator } from "./common/descriptor/move-validator";
import { BoundariesValidator } from "./common/move/move-validators/boundaries-validator";
import { DirectionValidator } from "./checkers/move/move-validators/direction-validator";
import { DistanceValidator } from "./checkers/move/move-validators/distance-validator";
import { MoveAnalyzer } from "./checkers/move/move-analyzer";
import { PlayerMoveStrategy } from "./checkers/move/player/player-move-strategy";
import { AiMoveStrategy } from "./checkers/move/ai/ai-move-strategy";
import { DirectionsDefinition } from "./common/move/move-direction";
import { Player, AiPlayer } from "./common/player/player";
import { CheckersPositionStrategy } from "./checkers/board/checkers-position-strategy";
import { CheckrsCellBuilder } from "./common/builders/checkers-cell-builder";
import { BoardController } from "./checkers/board/board-controller";
import { CheckersGameAnalyzer } from "./checkers/game/checkers-game-analyzer";

export class Model {
    private _board: Board<Checker>;
    private _playerMoveStrategy: IMoveStrategy<Checker>;
    private _computerMoveStrategy: IMoveStrategy<Checker>;
    private _gameState: GameStateManager<Checker>;
    private _playersManager: PlayersManager<Checker>;
    private _gameManager: GameManager<Checker>;
    private _moveManager: MoveManager<Checker>;
    private _moveAnalizer: MoveAnalyzer;

    constructor(public height: number, public width: number) {
        this._gameState = new GameStateManager(height, width);
        this._playersManager = new PlayersManager(this._gameState);

        this.setBoard(height, width);
    }

    get gameState(): GameStateManager<Checker> {
        return this._gameState;
    }

    public init(configurations: Configurations): GameStateManager<Checker> {
        this.setMoveComponents(configurations);
        this.setGameComponents();
        this.setPlayers(configurations);

        return this._gameState;
    }

    public start() {
        this._gameManager.startNewGame();
    }

    private setGameComponents() {
        const gameAnalyzer = new CheckersGameAnalyzer(this._board, this._moveAnalizer, this._playersManager);
        this._gameManager = new GameManager(this._gameState, this._playersManager, this._moveManager, gameAnalyzer);
    }

    private setMoveComponents(configurations: Configurations) {
        const moveValidator = new MoveValidator<Checker>();

        moveValidator.append(new BoundariesValidator());
        moveValidator.append(new DirectionValidator());
        moveValidator.append(new DistanceValidator());

        this._moveAnalizer = new MoveAnalyzer(this._playersManager, moveValidator);
        const boardController = new BoardController(this._board, this._moveAnalizer, this._playersManager);
        this._playerMoveStrategy = new PlayerMoveStrategy(this._gameState, moveValidator, this._moveAnalizer, this._playersManager, boardController);

        if (configurations.players[1].computer) {
            this._computerMoveStrategy = new AiMoveStrategy(this._gameState, moveValidator, this._moveAnalizer, this._playersManager, configurations.players[1].computerLevel, boardController);
        }

        this._moveManager = new MoveManager(this._gameState, this._playersManager);
    }

    private setPlayers(configurations: Configurations) {
        const players = [];
        players.push(new Player(configurations.players[0].name, 1, configurations.players[0].id, 1, DirectionsDefinition.Up, this._playerMoveStrategy));
        players.push(configurations.players[1].computer ?
            new AiPlayer(configurations.players[1].name || 'computer', 2, configurations.players[1].id, this.height, DirectionsDefinition.Down, this._computerMoveStrategy) :
            new Player(configurations.players[1].name, 2, configurations.players[1].id, 0, DirectionsDefinition.Down, this._playerMoveStrategy));

        this._playersManager.addPlayer(players[0]);
        this._playersManager.addPlayer(players[1]);
        this._gameState.updateCurrentPlayer(players[0]);
    }
    private setBoard(height: number, width: number) {
        this._board = new Board<Checker>(width, height,
            new CheckersPositionStrategy(width, height),
            this._playersManager.players,
            new CheckrsCellBuilder());
    }
}