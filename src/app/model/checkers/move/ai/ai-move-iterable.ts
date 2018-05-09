import { MoveDescriptor } from "../../../common/descriptor/move-descriptor";
import { IMoveAnalyzer } from "../../../common/interfaces/i-move-analyzer";
import { Checker } from "../../board/checker";
import { Board } from "../../../common/board/board";
import { SelectDescriptor } from "../../../common/descriptor/select-descriptor";
import { Players } from "../../../common/player/players";
import { Player } from "../../../common/player/player";
import { RankMap, moveRankMap } from "./move-rank-map";

export type Action<T> = (element: T) => {};

export class AiMoveIterable implements Iterable<MoveDescriptor[]> {
    private _depth: number;
    private _maxDepth = 10;
    private _rankMap: RankMap;
    constructor(private _moveAnalizer: IMoveAnalyzer<Checker>,
        private _players: Players<Checker>,
        private _board: Board<Checker>,
        private _moveAction: Action<MoveDescriptor>) {
        this._depth = 1;
        this._rankMap = moveRankMap;
    }

    *[Symbol.iterator](): IterableIterator<MoveDescriptor[]> {
        if (this._depth > this._maxDepth) {
            return;
        }

        this.getPosiibleMoves(this._players.current).forEach(move => {
            this._moveAction(move);
            const counterMove = this.getPosiibleMoves(this._players.opponent);
            const bestCouterMove = counterMove.reduce((prev, current) => this._rankMap[prev.type] > this._rankMap[current.type] ? prev : current);
            move.counterMove = bestCouterMove;
            this._moveAction(bestCouterMove);
        });

        this._depth++;

        yield* Array.from(this[Symbol.iterator]());
    }

    private getPosiibleMoves(player: Player<Checker>) {
        const playerCells = this._board.select(cell => cell.element && cell.element.id === player.id);
        let possibleMoves: MoveDescriptor[];
        playerCells.forEach(cell => {
            const select = new SelectDescriptor(cell.position, player.id, cell.element.id, player.direction);
            possibleMoves = this._moveAnalizer.getPossibleMoves(select, this._board);
        });

        return possibleMoves;
    }
}