import { Player } from "../../models/player.model";
import { observable } from "mobx";
import { ViewModel } from "../../../view-model/view-model";
import { ChangeEvent } from "../../../view-model/models/change-event";

export class PlayersStore {
    public players: { [id: string]: Player };
    @observable currentPlayer: Player;
    constructor(private _viewModel: ViewModel) {

        _viewModel.change.subscribe((changeEvent: ChangeEvent) => {
            this.currentPlayer = this.players[changeEvent.playerId.id];
        });
    }
}