import { Player } from "../../models/player.model";
import { observable, action, computed } from "mobx";
import { ViewModel } from "../../../view-model/view-model";
import { PlayerEvent } from "../../../view-model/models/player-event";

export class PlayersStore {
    public playersMap: { [id: string]: Player };
    @observable currentPlayer: Player;
    private _first: Player;
    
    constructor(private vm: ViewModel) {
        vm.playerChage.subscribe(this.changePlayer);
    }

    get first(): Player {
        return this._first;
    }

    @action.bound
    changePlayer(playerEvent: PlayerEvent) {
        this.currentPlayer = this.playersMap[playerEvent.id];
    }

    @action
    public addPlayer(player: Player) {
        if (!this.playersMap) {
            this.playersMap = {};
            this._first = player;
            this.currentPlayer = player;
        }

        this.playersMap[player.id] = player;
    }
}