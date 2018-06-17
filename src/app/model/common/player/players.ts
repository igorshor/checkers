import { Player } from "./player";
import { IIdentible } from "../interfaces/i-Identible";

export class Players<T extends IIdentible> {
    protected _currentPlayer: Player<T>;
    private _players: Player<T>[];
    private _playersMap: { [id: string]: Player<T> };

    addPlayer(player: Player<T>, current: boolean = false) {
        this._players = this._players || [];
        this._playersMap = this._playersMap || {};

        if (this._playersMap[player.id] !== undefined) {
            throw new Error('two player with the same id');
        }

        this._playersMap[player.id] = player;
        this._players.push(player);

        if (current) {
            this._currentPlayer = player;
        }
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

    get(id: string) {
        if (this._playersMap[id] === undefined) {
            throw new Error('player does not exist');
        }

        return this._playersMap[id];
    }

    switch(): Player<T> {
        this._currentPlayer = this.getOtherPlayer();
        return this._currentPlayer;
    }

    private getOtherPlayer(): Player<T> {
        return this._players[0] === this._currentPlayer ? this._players[1] : this._players[0];
    }
}