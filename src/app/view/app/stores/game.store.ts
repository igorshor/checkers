import { observable, computed, reaction, action } from 'mobx';
import { Board } from '../../models/board.model';
import { Configurations } from '../../../model/models/game-configurations';
import { ViewModel } from '../../../view-model/view-model';
import { GameEvent, GameStage } from '../../../view-model/models/game-event';
import { Observable, Subject } from '@reactivex/rxjs';
import { SelectionEvent } from '../../../view-model/models/selection-event';
// TODO !!!!!!!!!!!!!!!!!!!!!!!!!!!!
// reference to actual model :(

export class GameStore {
    @observable _state: GameStage;

    private _configurationSetted = new Subject<Configurations>();
    private _selected = new Subject<SelectionEvent>();

    constructor(private vm: ViewModel) {
        vm.game.subscribe((gameEvent: GameEvent) => {
            this.setState(gameEvent.state);
        });
    }

    @computed
    get initialized(): boolean {
        return this._state === GameStage.Game || this._state === GameStage.Finish;
    }

    @computed
    get state(): GameStage {
        return this._state;
    }

    @action
    private setState(value: GameStage) {
        this._state = value;
    }

    public get configurationSetted(): Observable<Configurations> {
        return this._configurationSetted.asObservable();
    }

    public get selected(): Observable<SelectionEvent> {
        return this._selected.asObservable();
    }

    public start(configurations: Configurations) {
        this._configurationSetted.next(configurations);
    }


}