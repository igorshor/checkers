import { Checker } from "../board/checker";
import { IGameAnalyzer } from "../../common/interfaces/i-game-analyzer";
import { Board } from "../../common/board/board";
import { Players } from "../../common/player/players";
import { GameState } from "../../common/game/game-state";

export class CheckersGameAnalyzer implements IGameAnalyzer<Checker> {
    constructor(private _board: Board<Checker>, private _players: Players<Checker>) {

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
        return false;
    }

    private isDeadLock(): boolean {
        return false;
    }
}