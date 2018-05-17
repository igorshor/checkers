import { Observable, Subject } from "@reactivex/rxjs";
import { GameStateManager } from "../../common/game/game-state-manager";
import { PlayerEvent } from "../models/player-event";
import { GameEvent } from "../models/game-event";
import { Cell } from "../../common/board/cell";
import { Checker } from "../../checkers/board/checker";
import { CheckerEvent } from "../models/checker-event";
import { BoardEvent } from "../models/board-event";

export class ConsumerApi {
    private _player = new Subject<PlayerEvent>();
    private _game = new Subject<GameEvent>();
    private _board = new Subject<BoardEvent>();
    constructor(private _state: GameStateManager<any>) {
        this.init();
    }
    private init() {
        this._state.currentPlayer.subscribe(player => this._player.next(new PlayerEvent(player.publicId, player.name)));
        this._state.gameStage.subscribe(game => this._game.next(new GameEvent(game.gameStage, game.winner, game.draw)));
        this._state.board.subscribe((cells: Cell<Checker>[][]) => this._board
            .next(new BoardEvent(
                cells
                    .map(i => i
                        .map(j => new CheckerEvent({ x: j.position.x, y: j.position.y }, j.element.id)
                        )))));
    }

    get change() {
        return this.player;
    }

    get player(): Observable<PlayerEvent> {
        return this._player.asObservable();
    }

    get game(): Observable<GameEvent> {
        return this._game.asObservable();
    }

    get board(): Observable<BoardEvent> {
        return this._board.asObservable();
    }
}