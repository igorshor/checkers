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
import { View } from "../view";
import { SelectionEvent } from "./models/selection-event";
import { Configurations } from "../model/models/game-configurations";
import { SelectionContext } from "../model/common/board/selection-context";

const PRE_SET = require('./presets/king-dev-board');
const INCLUDE_PRE_SET = true;

interface ModelEvents {
    readonly change: Observable<ChangeEvent>;
    readonly game: Observable<GameEvent>;
    readonly board: Observable<BoardEvent>;
}

export class ViewModel implements ModelEvents {
    private _change = new Subject<ChangeEvent>();
    private _game = new Subject<GameEvent>();
    private _board = new Subject<BoardEvent>();
    private _playerChange = new Subject<PlayerEvent>();
    private _currentPlayer: Player<Checker>;
    private _state: GameStateManager<Checker>;

    constructor(private _model: Model, private _view: View) {
        this._state = this._model.gameState;
        this.init();
    }

    public bootstrap() {
        this._view.bootstrap(this);
        this.registerEvents();
    }

    private registerEvents() {
        const { selected, configurationSetted } = this._view.viewHooks;
        selected.subscribe((selectionEvent?: SelectionEvent) => {
            const selectDescriptor = selectionEvent ? new SelectionContext(selectionEvent.position, selectionEvent.playerId) : null;
            this._state.updateSelection(selectDescriptor);
        });

        configurationSetted.subscribe((configuration: Configurations) => {
            this._model.init(configuration, INCLUDE_PRE_SET && PRE_SET);
            this._model.start();
        });
    }

    private _onPlayerChange = (playerToSelect: Player<Checker>) => {
        this._playerChange.next(new PlayerEvent(playerToSelect.id, playerToSelect.name))
        this._currentPlayer = playerToSelect;
    }

    private init() {
        this._state.currentPlayer.subscribe(this._onPlayerChange);
        this._state.gameStage.subscribe(game => this._game.next(new GameEvent(game.gameStage, game.winner, game.draw)));
        this._state.cells.subscribe((cells: Cell<Checker>[]) => this._change.next(new ChangeEvent(cells.map(cell => {
                    const isPrediction = cell.state === CellState.Prediction;

                    return new CheckerEvent(
                        cell.position,
                        cell.element ? cell.element.correlationId : isPrediction ? this._currentPlayer.id : undefined,
                        cell.type,
                        isPrediction,
                        cell.element?.isKing,
                        cell.element?.selected,
                        cell.element?.movable
                    );
                })
            )));

        this._state.board.subscribe((cells: Cell<Checker>[][]) => this._board
            .next(new BoardEvent(
                cells
                    .map(i => i
                        .filter(k => k.element)
                        .map(j => new CheckerEvent({ x: j.position.x, y: j.position.y }, j.element.correlationId, j.type)
                        )), this._state.width, this._state.height)));
    }

    get change(): Observable<ChangeEvent> {
        return this._change.asObservable();
    }

    get playerChage(): Observable<PlayerEvent> {
        return this._playerChange.asObservable();
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