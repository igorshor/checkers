import { GameStateManager } from "./game-state";
import { Player } from "./player";
import { IPlayersManager } from "../interfaces/i-players-maneger";

export class PlayersManager implements IPlayersManager {
    private _currentPlayer: Player;
    private _players: Player[];

    constructor(private _gameState: GameStateManager) {
        this._gameState.player.subscribe(player => this._currentPlayer = player);
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

    switch(): void {
        this._gameState.updateCurrentPlayer(this.getOtherPlayer());
    }

    private getOtherPlayer(): Player {
        return this._players[0] === this._currentPlayer ? this._players[1] : this._players[0];
    }
}