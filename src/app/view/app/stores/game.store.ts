import { observable, computed, reaction, action } from 'mobx';
import { Board } from '../../models/board.model';
import { Configurations } from '../../../model/models/game-configurations';
import { ViewModel } from '../../../view-model/view-model';
// TODO !!!!!!!!!!!!!!!!!!!!!!!!!!!!
// view update its state :(
// reference to actual model :(
export enum GameState {
    Init,
    Play,
    Finish
}

export class GameStore {
    @observable state: GameState;
    @observable configurations: Configurations;


    constructor(private vm: ViewModel, state: GameState = GameState.Init) {
        this.state = state;
    }

    @computed
    get initialized(): boolean {
        return this.state !== GameState.Init;
    }

    @action
    public start() {
        // todo : EVENT !
    }
}