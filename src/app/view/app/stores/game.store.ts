import { observable, computed, reaction } from 'mobx';
import { Board } from '../../models/board.model';

export class GameStore {
    @observable state: any;
}