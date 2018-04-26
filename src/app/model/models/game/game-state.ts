import { Observable, Subject } from '@reactivex/rxjs';
import { Player } from './player';
import { Cell } from '../board/cell';
import { GameStage } from './game-stage';
import { SelectDescriptor } from '../move/select-descriptor';
import { Checker } from '../board/checker';

export class GameStateManager {
    private _playerChanged = new Subject<Player>();
    private _gameState = new Subject<GameStage>();
    private _cellChanged = new Subject<Cell<Checker>>();
    private _cellsChanged = new Subject<Cell<Checker>[]>();
    private _boardChanged = new Subject<Cell<Checker>[][]>();
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

    get gameState(): Observable<GameStage> {
        return this._gameState.asObservable();
    }

    public updateCell(value: Cell<Checker>) {
        this._cellChanged.next(value);
    }

    get cell(): Observable<Cell<Checker>> {
        return this._cellChanged.asObservable();
    }

    public updateCells(value: Cell<Checker>[]) {
        this._cellsChanged.next(value);
    }

    get cells(): Observable<Cell<Checker>[]> {
        return this._cellsChanged.asObservable();
    }


    public updateBoard(value: Cell<Checker>[][]) {
        this._boardChanged.next(value);
    }

    get board(): Observable<Cell<Checker>[][]> {
        return this._boardChanged.asObservable();
    }
}