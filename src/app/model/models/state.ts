import {Observable, Subject} from '@reactivex/rxjs'

export class GameState{
    private _playerChanged = new Subject<string>()
    private _player = this._playerChanged.asObservable();
    public updatePlayer(value:string){
        this._playerChanged.next(value);
    }

    get player():Observable<string>{
        return this._player;
    }
}