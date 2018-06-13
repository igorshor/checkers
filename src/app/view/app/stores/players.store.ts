import { Player } from "../../models/player.model";
import { observable, action, computed } from "mobx";
import { ViewModel } from "../../../view-model/view-model";
import { ChangeEvent } from "../../../view-model/models/change-event";

export class PlayersStore {
    public playersMap: { [id: string]: Player };
    @observable currentPlayer: Player;
    private _first: Player;
    constructor(private vm: ViewModel) {
        vm.change.subscribe((changeEvent: ChangeEvent) => {
            this.currentPlayer = this.playersMap[changeEvent.playerId.id];
        });
    }

    get first(): Player {
        return this._first;
    }

    @action
    public addPlayer(player: Player) {
        if (!this.playersMap) {
            this.playersMap = {};
            this._first = player;
        }

        this.playersMap[player.id] = player;
    }
}