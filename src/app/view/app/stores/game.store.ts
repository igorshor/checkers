import { observable, computed, reaction, action } from 'mobx';
import { Board } from '../../models/board.model';
import { Configurations } from '../../../model/models/game-configurations';

export enum GameState {
    Init,
    Play,
    Finish
}

export class GameStore {
    @observable state: GameState;
    @observable configurations: Configurations;


    constructor(state: GameState = GameState.Init) {
        this.state = state;
    }

    @computed
    get initialized(): boolean {
        return this.state !== GameState.Init;
    }

    @action
    public start() {
        this.state = GameState.Play;
    }
}