import { MoveDescriptor } from "../../../common/descriptor/move-descriptor";
import { IMoveAnalyzer } from "../../../common/interfaces/i-move-analyzer";
import { Checker } from "../../board/checker";
import { Board } from "../../../common/board/board";
import { SelectDescriptor } from "../../../common/descriptor/select-descriptor";
import { Players } from "../../../common/player/players";
import { Player } from "../../../common/player/player";
import { RankMap, moveRankMap } from "./move-rank-map";
import { IBoardController } from "../../../common/interfaces/i-board-controller";

export class AiMoveIterable implements Iterable<MoveDescriptor[]> {
    public depth: number;
    private _maxDepth = 10;
    private _rankMap: RankMap;
    constructor(private _moveAnalizer: IMoveAnalyzer<Checker>,
        private _players: Players<Checker>,
        private _board: Board<Checker>,
        private _boardController: IBoardController<Checker>) {
        this.depth = 0;
        this._rankMap = moveRankMap;
    }

    *getGenerator(value?: any): IterableIterator<MoveDescriptor[]> {
        let stop = false;

        while (!stop) {
            stop = yield ++this.depth > this._maxDepth && this.singleAiMove();
        }
    }

    *[Symbol.iterator](): IterableIterator<MoveDescriptor[]> {
        return yield *this.getGenerator();
    }

    private singleAiMove(): MoveDescriptor[] {
        const possibleMoves = this.getPosiibleMoves(this._players.current);
        possibleMoves.forEach(move => {
            this._boardController.doMove(move);
            const counterMove = this.getPosiibleMoves(this._players.opponent);
            const bestCouterMove = counterMove.reduce((prev, current) => this._rankMap[prev.type] > this._rankMap[current.type] ? prev : current);
            move.counterMove = bestCouterMove;
            this._boardController.doMove(bestCouterMove);
        });

        return possibleMoves;
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