import { Observable, Subject } from "@reactivex/rxjs";
import { GameStateManager } from "../model/common/game/game-state-manager";
import { PlayerEvent } from "./models/player-event";
import { GameEvent } from "./models/game-event";
import { Cell } from "../model/common/board/cell";
import { Checker } from "../model/checkers/board/checker";
import { CheckerEvent } from "./models/checker-event";
import { BoardEvent } from "./models/board-event";
import { Player } from "../model/common/player/player";
import { ChangeEvent } from "./models/change-event";
import { CellState } from "../model/common/board/cell-state";
import { Model } from "../model";
import { Configurations } from "../model/models/game-configurations";

export class ViewModel {
    private _change = new Subject<ChangeEvent>();
    private _game = new Subject<GameEvent>();
    private _board = new Subject<BoardEvent>();
    private _currentPlayer: Player<Checker>;
    private _state: GameStateManager<Checker>;
    private _configurations: Configurations;

    constructor(private _model: Model) {
        this._state = this._model.gameState;
        this.init();
    }
    private init() {
        this._state.currentPlayer.subscribe(player => this._currentPlayer = player);
        this._state.gameStage.subscribe(game => this._game.next(new GameEvent(game.gameStage, game.winner, game.draw)));
        this._state.cells.subscribe((cells: Cell<Checker>[]) => this._change
            .next(new ChangeEvent(new PlayerEvent(this._currentPlayer.publicId, this._currentPlayer.name),
                cells
                    .map(cell => new CheckerEvent(cell.position, cell.element ? cell.element.id : this._currentPlayer.id, cell.type, cell.state === CellState.Prediction))
            )));

        this._state.board.subscribe((cells: Cell<Checker>[][]) => this._board
            .next(new BoardEvent(
                cells
                    .map(i => i
                        .map(j => new CheckerEvent({ x: j.position.x, y: j.position.y }, j.element.id, j.type)
                        )), this._state.width, this._state.height)));
    }

    public start(conf: Configurations) {
        this._configurations = conf;
        this._model.init(conf);
        this._model.start();
    }

    public restart() {
        if (!this._configurations) {
            throw new Error('the game not started yet');
        }

        this._model.start();
    }

    get change() {
        return this._change.asObservable();
    }

    get game(): Observable<GameEvent> {
        return this._game.asObservable();
    }

    get board(): Observable<BoardEvent> {
        return this._board.asObservable();
    }

    get width(): number {
        return this._state.width;
    }

    get height(): number {
        return this._state.height;
    }
}