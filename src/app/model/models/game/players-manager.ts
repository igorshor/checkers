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

    switch(): void {
        this._gameState.updateCurrentPlayer(this._players[0] === this._currentPlayer ? this._players[1] : this._players[0]);
    }
}