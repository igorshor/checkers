import { Observable, Subject, BehaviorSubject } from '@reactivex/rxjs';
import { Cell } from '../board/cell';
import { GameStage } from './game-stage';
import { IIdentible } from '../interfaces/i-Identible';
import { Player } from '../player/player';
import { SelectDescriptor } from '../descriptor/select-descriptor';
import { GameStateDescriptor } from './game-state-descriptor';
import { SelectionContext } from '../board/selection-context';

export class GameStateManager<T extends IIdentible> {
    private _currentPlayerChanged = new Subject<Player<T>>();
    private _gameState = new BehaviorSubject<GameStateDescriptor<T>>(new GameStateDescriptor());
    private _cellChanged = new Subject<Cell<T>>();
    private _cellsChanged = new Subject<Cell<T>[]>();
    private _boardChanged = new Subject<Cell<T>[][]>();
    private _selectionChanged = new Subject<SelectDescriptor>();
    private _beforePlayerChanged = new Subject<void>();

    constructor(public readonly height: number, public readonly width: number) {

    }

    public updateSelection(value?: SelectionContext) {
        this._selectionChanged.next(value ? new SelectDescriptor(value.position, value.playerId, value.elementId) : null);
    }

    get selection(): Observable<SelectDescriptor> {
        return this._selectionChanged.asObservable();
    }

    public notifyBeforePlayerChanged() {
        this._beforePlayerChanged.next();
    }

    get beforePlayerChanged(): Observable<void> {
        return this._beforePlayerChanged.asObservable();
    }

    public updateCurrentPlayer(value: Player<T>) {
        this._currentPlayerChanged.next(value);
    }

    get currentPlayer(): Observable<Player<T>> {
        return this._currentPlayerChanged.asObservable();
    }

    public updateGameState(value: GameStateDescriptor<T>) {
        this._gameState.next(value);
    }

    get gameStage(): Observable<GameStateDescriptor<T>> {
        return this._gameState.asObservable();
    }

    public updateCell(value: Cell<T>) {
        this._cellChanged.next(value);
    }

    get cell(): Observable<Cell<T>> {
        return this._cellChanged.asObservable();
    }

    public updateCells(value: Cell<T>[]) {
        this._cellsChanged.next(value);
    }

    get cells(): Observable<Cell<T>[]> {
        return this._cellsChanged.asObservable();
    }


    public updateBoard(value: Cell<T>[][]) {
        this._boardChanged.next(value);
    }

    get board(): Observable<Cell<T>[][]> {
        return this._boardChanged.asObservable();
    }
}