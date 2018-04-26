import { Player } from "./player";
import { GameStateManager } from "../game/game-state";
import { IIdentible } from "../interfaces/i-Identible";

export class PlayersManager<T extends IIdentible> {
    private _currentPlayer: Player;
    private _players: Player[];

    constructor(private _gameState: GameStateManager<T>) {
        this._gameState.player.subscribe((player: Player) => this._currentPlayer = player);
    }

    addPlayer(player: Player) {
        this._players = this._players || [];
        this._players.push(player);
    }

    get players(): Player[] {
        return this._players;
    }

    get current(): Player {
        return this._currentPlayer;
    }

    get opponent(): Player {
        return this.getOtherPlayer();
    }

    public exist(id: any): boolean {
        return this._players.findIndex(player => player.id === id) >= 0;
    }

    switch(): Player {
        const otherPlayer = this.getOtherPlayer();
        this._gameState.updateCurrentPlayer(otherPlayer);
        return otherPlayer;
    }

    private getOtherPlayer(): Player {
        return this._players[0] === this._currentPlayer ? this._players[1] : this._players[0];
    }
}