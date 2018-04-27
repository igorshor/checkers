import { Player } from "./player";
import { GameStateManager } from "../game/game-state";
import { IIdentible } from "../interfaces/i-Identible";

export class PlayersManager<T extends IIdentible> {
    private _currentPlayer: Player<T>;
    private _players: Player<T>[];

    constructor(private _gameState: GameStateManager<T>) {
        this._gameState.player.subscribe((player: Player<T>) => this._currentPlayer = player);
    }

    addPlayer(player: Player<T>) {
        this._players = this._players || [];
        this._players.push(player);
    }

    get players(): Player<T>[] {
        return this._players;
    }

    get current(): Player<T> {
        return this._currentPlayer;
    }

    get opponent(): Player<T> {
        return this.getOtherPlayer();
    }

    public exist(id: any): boolean {
        return this._players.findIndex(player => player.id === id) >= 0;
    }

    switch(): Player<T> {
        const otherPlayer = this.getOtherPlayer();
        this._gameState.updateCurrentPlayer(otherPlayer);
        return otherPlayer;
    }

    private getOtherPlayer(): Player<T> {
        return this._players[0] === this._currentPlayer ? this._players[1] : this._players[0];
    }
}