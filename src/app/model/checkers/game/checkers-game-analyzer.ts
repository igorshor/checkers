import { Checker } from "../board/checker";
import { IGameAnalyzer } from "../../common/interfaces/i-game-analyzer";
import { Board } from "../../common/board/board";
import { Players } from "../../common/player/players";
import { GameState } from "../../common/game/game-state";
import { IMoveAnalyzer } from "../../common/interfaces/i-move-analyzer";
import { Player } from "../../common/player/player";

export class CheckersGameAnalyzer implements IGameAnalyzer<Checker> {
    constructor(private _board: Board<Checker>, private _moveAnalyzer: IMoveAnalyzer<Checker>, private _players: Players<Checker>) {

    }

    getGameState(): GameState {
        if (this.isDeadLock) {
            return GameState.Draw;
        } else if (this.hasWinner()) {
            return GameState.Winner;
        }

        return GameState.Game;
    }

    private hasWinner() {
        return !this._board.elementsMap[this._players.current.id].length;
    }

    private isDeadLock(): boolean {
        return !this.hasMoves(this._players.opponent) && !this.hasMoves(this._players.current);
    }

    private hasMoves(player: Player<Checker>): boolean {
        return this._moveAnalyzer.getPossibleMovesByPlayer(player, this._board).length > 0;
    }
}