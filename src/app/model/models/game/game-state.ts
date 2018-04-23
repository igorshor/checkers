import {Observable, Subject} from '@reactivex/rxjs'
import { Player } from './player';
import { Cell } from '../board/cell';
import { GameStage } from './game-stage';

export class GameStateManager {
    private _playerChanged = new Subject<Player>();
    private _gameState = new Subject<GameStage>();
    private _cellChanged = new Subject<Cell>();
    private _boardChanged = new Subject<Cell[][]>();
    
    public updateCurrentPlayer(value:Player){
        this._playerChanged.next(value);
    }

    get player():Observable<Player>{
        return this._playerChanged.asObservable();
    }

    public updateGameState(value:GameStage){
        this._gameState.next(value);
    }

    get gameState():Observable<GameStage>{
        return this._gameState.asObservable();
    }

    public updateCell(value:Cell){
        this._cellChanged.next(value);
    }

    get cell():Observable<Cell>{
        return this._cellChanged.asObservable();
    }

    public updateBoard(value:Cell[][]){
        this._boardChanged.next(value);
    }

    get board():Observable<Cell[][]>{
        return this._boardChanged.asObservable();
    }
}