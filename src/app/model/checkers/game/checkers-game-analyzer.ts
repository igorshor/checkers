import { Checker } from "../board/checker";
import { IGameAnalyzer } from "../../common/interfaces/i-game-analyzer";
import { Board } from "../../common/board/board";
import { Players } from "../../common/player/players";
import { GameState } from "../../common/game/game-state";
import { IMoveAnalyzer } from "../../common/interfaces/i-move-analyzer";
import { Player } from "../../common/player/player";
import { Cell } from "../../common/board/cell";

export class CheckersGameAnalyzer implements IGameAnalyzer<Checker> {
    constructor(private _board: Board<Checker>, private _moveAnalyzer: IMoveAnalyzer<Checker>, private _players: Players<Checker>) {
    }

    getGameState(): GameState {
        if (this.isDeadLock) {
            return GameState.Draw;
        } else if (this.hasWinner) {
            return GameState.Winner;
        }

        return GameState.Game;
    }

    checkForMovableComponents(player: Player<Checker>): Cell<Checker>[] {
        const cellToReturnTodefaultState = this._board.select((cell) => cell.element?.movable)
        cellToReturnTodefaultState.forEach(cell => cell.element.movable = false);
        
        const possiblePlayerMovesCheckers = this._moveAnalyzer.getPossibleMovesByPlayer(player, this._board).map(move => this._board.getCellByPosition(move.initialMove.from));
        possiblePlayerMovesCheckers.forEach(checker => checker.element.movable = true);

        return Array.from(new Set([...cellToReturnTodefaultState, ...possiblePlayerMovesCheckers]));
    }

    private get hasWinner() {
        return !this._board.elementsMap[this._players.current.id].length;
    }

    private get isDeadLock(): boolean {
        return !this.hasMoves(this._players.opponent) && !this.hasMoves(this._players.current);
    }

    private hasMoves(player: Player<Checker>): boolean {
        return this._moveAnalyzer.getPossibleMovesByPlayer(player, this._board).length > 0;
    }
}