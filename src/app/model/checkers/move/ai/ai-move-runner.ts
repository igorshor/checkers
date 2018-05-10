import { MoveDescriptor } from "../../../common/descriptor/move-descriptor";
import { IMoveAnalyzer } from "../../../common/interfaces/i-move-analyzer";
import { Checker } from "../../board/checker";
import { Board } from "../../../common/board/board";
import { SelectDescriptor } from "../../../common/descriptor/select-descriptor";
import { Players } from "../../../common/player/players";
import { Player } from "../../../common/player/player";
import { RankMap, moveRankMap } from "./move-rank-map";
import { IBoardController } from "../../../common/interfaces/i-board-controller";
import { AiMoveDescriptor } from "./ai-move-descriptor";

export class AiMoveRunner {
    private _rankMap: RankMap;
    private _root: AiMoveDescriptor;

    constructor(private _moveAnalizer: IMoveAnalyzer<Checker>,
        private _players: Players<Checker>,
        board: Board<Checker>,
        private _boardController: IBoardController<Checker>,
        private _maxDepth = 1) {
        this._rankMap = moveRankMap;
        this._root = new AiMoveDescriptor(undefined, undefined);
        this._root.boardState = board.immutableBoard;
    }

    async calculate(): Promise<AiMoveDescriptor> {
        await this.aiMoveRunner(1, this._root);

        return this._root;
    }

    private aiMoveRunner(depth: number, parent: AiMoveDescriptor): AiMoveDescriptor[] {
        if (this._maxDepth < depth) {
            return;
        }
        const board = parent.boardState;
        const possibleMoves = this.getPosiibleMoves(this._players.current, board)
            .map(move => new AiMoveDescriptor(move, parent));

        possibleMoves.forEach(move => {
            this._boardController.doMove(move);
            move.boardState = board.immutableBoard;
            const counterMove = this.getPosiibleMoves(this._players.opponent, board);
            const bestCouterMove = counterMove.reduce((prev, current) => this._rankMap[prev.type] > this._rankMap[current.type] ? prev : current);
            move.counterMove = bestCouterMove;
            this._players.switch();
            this._boardController.doMove(bestCouterMove);
            move.boardState = board.immutableBoard;
            this._root.add(move);
            this.aiMoveRunner(depth++, move);
        });
    }

    private getPosiibleMoves(player: Player<Checker>, board: Board<Checker>) {
        const playerCells = board.select(cell => cell.element && cell.element.id === player.id);
        let possibleMoves: MoveDescriptor[];
        playerCells.forEach(cell => {
            const select = new SelectDescriptor(cell.position, player.id, cell.element.id, player.direction);
            possibleMoves = this._moveAnalizer.getPossibleMoves(select, board);
        });

        return possibleMoves;
    }
}