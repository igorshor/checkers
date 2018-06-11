import { Player } from "../../models/player.model";
import { observable, action } from "mobx";
import { ViewModel } from "../../../view-model/view-model";
import { ChangeEvent } from "../../../view-model/models/change-event";

export class PlayersStore {
    public players: { [id: string]: Player };
    @observable currentPlayer: Player;
    constructor(private vm: ViewModel) {

        vm.change.subscribe((changeEvent: ChangeEvent) => {
            this.currentPlayer = this.players[changeEvent.playerId.id];
        });
    }

    @action
    public addPlayer(player: Player) {
        this.players = this.players || {};
        this.players[player.id] = player;
    }
}