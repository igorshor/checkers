import { Observable, Subject } from "@reactivex/rxjs";
import { GameStateManager } from "../../common/game/game-state-manager";
import { PlayerEvent } from "../models/player-event";
import { GameEvent } from "../models/game-event";
import { Cell } from "../../common/board/cell";
import { Checker } from "../../checkers/board/checker";
import { CheckerEvent } from "../models/checker-event";
import { BoardEvent } from "../models/board-event";
import { Player } from "../../common/player/player";
import { ChangeEvent } from "../models/change-event";
import { CellState } from "../../common/board/cell-state";

export class ConsumerApi {
    private _change = new Subject<ChangeEvent>();
    private _game = new Subject<GameEvent>();
    private _board = new Subject<BoardEvent>();
    private _currentPlayer: Player<Checker>;
    constructor(private _state: GameStateManager<Checker>) {
        this.init();
    }
    private init() {
        this._state.currentPlayer.subscribe(player => this._currentPlayer = player);
        this._state.gameStage.subscribe(game => this._game.next(new GameEvent(game.gameStage, game.winner, game.draw)));
        this._state.cells.subscribe((cells: Cell<Checker>[]) => this._change.next(new ChangeEvent(this._currentPlayer.publicId, [
            ...cells.map(cell => new CheckerEvent(cell.position, cell.element ? cell.element.id : this._currentPlayer.id, cell.type, cell.state === CellState.Prediction))
        ])));
        this._state.board.subscribe((cells: Cell<Checker>[][]) => this._board
            .next(new BoardEvent(
                cells
                    .map(i => i
                        .map(j => new CheckerEvent({ x: j.position.x, y: j.position.y }, j.element.id, j.type)
                        )))));
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
}