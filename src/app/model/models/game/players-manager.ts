import { GameStateManager } from "./game-state";
import { Player } from "./player";
import { IPlayersManager } from "../interfaces/i-players-maneger";

export class PlayersManager implements IPlayersManager {
    private _currentPlayer: Player;

    constructor(private _gameState: GameStateManager, private _players: Player[]) {
        this._gameState.player.subscribe(Player => {
            this._currentPlayer = Player;
        })
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
        return this._players[0] === this._currentPlayer ? this._players[1] : this._players[0]
    }
}