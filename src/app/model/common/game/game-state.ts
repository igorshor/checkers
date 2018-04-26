import { Observable, Subject, BehaviorSubject } from '@reactivex/rxjs';
import { Cell } from '../board/cell';
import { GameStage } from './game-stage';
import { IIdentible } from '../interfaces/i-Identible';
import { Player } from '../player/player';
import { SelectDescriptor } from '../descriptor/select-descriptor';

export class GameStateManager<T extends IIdentible> {
    private _playerChanged = new Subject<Player>();
    private _gameState = new BehaviorSubject<GameStage>(GameStage.Init);
    private _cellChanged = new Subject<Cell<T>>();
    private _cellsChanged = new Subject<Cell<T>[]>();
    private _boardChanged = new Subject<Cell<T>[][]>();
    private _selectionChanged = new Subject<SelectDescriptor>();

    public updateSelection(value: SelectDescriptor) {
        this._selectionChanged.next(value);
    }

    get selection(): Observable<SelectDescriptor> {
        return this._selectionChanged.asObservable();
    }

    public updateCurrentPlayer(value: Player) {
        this._playerChanged.next(value);
    }

    get player(): Observable<Player> {
        return this._playerChanged.asObservable();
    }

    public updateGameState(value: GameStage) {
        this._gameState.next(value);
    }

    get gameStage(): Observable<GameStage> {
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