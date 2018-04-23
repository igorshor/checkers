import { IContextProvider } from "../interfaces/i-context-provier";
import { GameStateManager } from "../game/game-state";
import { Player } from "../game/player";

export class ContextProvider implements IContextProvider {
    private _currentPlayer:Player;
    constructor(private _state:GameStateManager){
        this._state.player.subscribe(player => this._currentPlayer = player);
    }

    get current() {
        return this._currentPlayer.id;
    }
}