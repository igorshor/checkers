import { Board } from "./common/board/board";
import { Checker } from "./checkers/board/checker";
import { IMoveStrategy } from "./common/interfaces/i-move-strategy";
import { GameStateManager } from "./common/game/game-state-manager";
import { PlayersManager } from "./common/player/players-manager";
import { GameManager } from "./common/game/game-manager";
import { MoveManager } from "./common/move/move-manager";
import { Configurations } from "./models/game-configurations";
import { MoveValidator } from "./common/validation/move-validator";
import { BoundariesValidator } from "./common/move/move-validators/boundaries-validator";
import { DirectionValidator } from "./checkers/move/move-validators/direction-validator";
import { DistanceValidator } from "./checkers/move/move-validators/distance-validator";
import { MoveAnalyzer } from "./checkers/move/move-analyzer";
import { PlayerMoveStrategy } from "./checkers/move/player/player-move-strategy";
import { AiMoveStrategy } from "./checkers/move/ai/ai-move-strategy";
import { DirectionsDefinition } from "./common/move/move-direction";
import { Player, AiPlayer } from "./common/player/player";
import { CheckersPositionStrategy } from "./checkers/board/checkers-position-strategy";
import { BoardController } from "./checkers/board/board-controller";
import { CheckersGameAnalyzer } from "./checkers/game/checkers-game-analyzer";
import { CheckrsBuilder } from "./checkers/board/checkers-builder";
import { OverrideValidator } from "./checkers/move/move-validators/override-validator";
import { MoveTypeValidator } from "./common/move/move-validators/move-type-validator";
import { KingValidator } from "./checkers/move/move-validators/king-validator";
import { IIdentible } from "./common/interfaces/i-Identible";

declare global {
    interface Window {
        board: Board<Checker>;
    }
}

export class Model {
    private _board: Board<Checker>;
    private _playerMoveStrategy: IMoveStrategy<Checker>;
    private _computerMoveStrategy: IMoveStrategy<Checker>;
    private _gameState: GameStateManager<Checker>;
    private _playersManager: PlayersManager<Checker>;
    private _gameManager: GameManager<Checker>;
    private _moveManager: MoveManager<Checker>;
    private _moveAnalizer: MoveAnalyzer;
    private _currentPlayer: Player<Checker>;

    constructor(public height: number, public width: number) {
        this._gameState = new GameStateManager(height, width);
        this._playersManager = new PlayersManager(this._gameState);
    }

    get gameState(): GameStateManager<Checker> {
        return this._gameState;
    }

    public init(configurations: Configurations, cellImage?: IIdentible[][]): void {
        this.setBoard(this.height, this.width);
        this.setMoveComponents(configurations);
        this.setPlayers(configurations);
        this._board.init(this._playersManager.players);

        if (cellImage) {
            this._board.restoreFromImage(cellImage, this._playersManager.players)
        }

        this.setGameComponents();
        this._gameState.updateBoard(this._board.cells);
        this._gameState.updateCurrentPlayer(this._currentPlayer);

        window.board = this._board;
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
        moveValidator.append(new MoveTypeValidator());
        moveValidator.append(new DirectionValidator());
        moveValidator.append(new DistanceValidator());
        moveValidator.append(new OverrideValidator());
        moveValidator.append(new KingValidator());

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
        players.push(new Player(configurations.players[0].name, configurations.players[0].id, 0, DirectionsDefinition.Up, this._playerMoveStrategy));

        players.push(configurations.players[1].computer ?
            new AiPlayer(configurations.players[1].name || 'computer', configurations.players[1].id, this.height - 1, DirectionsDefinition.Down, this._computerMoveStrategy) :
            new Player(configurations.players[1].name, configurations.players[1].id, this.height - 1, DirectionsDefinition.Down, this._playerMoveStrategy));

        this._playersManager.addPlayer(players[0]);
        this._playersManager.addPlayer(players[1]);
        this._currentPlayer = players[0]
    }
    private setBoard(height: number, width: number) {
        this._board = new Board<Checker>(width, height,
            new CheckersPositionStrategy(width, height),
            new CheckrsBuilder(this._playersManager));
    }
}