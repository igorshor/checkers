import { MoveDescriptor } from "../../../common/descriptor/move-descriptor";
import { IMoveAnalyzer } from "../../../common/interfaces/i-move-analyzer";
import { Checker } from "../../board/checker";
import { Board } from "../../../common/board/board";
import { SelectDescriptor } from "../../../common/descriptor/select-descriptor";
import { Players } from "../../../common/player/players";
import { Player } from "../../../common/player/player";
import { RankMap, moveRankMap } from "./move-rank-map";
import { IBoardController } from "../../../common/interfaces/i-board-controller";
import { AiMoveDescriptorItem } from "./ai-move-descriptor-item";
import { AiMovesDescriptor } from "./ai-move-descriptor";

export class AiMoveRunner {
    private _rankMap: RankMap;
    private _aiMoves: AiMovesDescriptor;

    constructor(private _moveAnalizer: IMoveAnalyzer<Checker>,
        private _players: Players<Checker>,
        private _board: Board<Checker>,
        private _boardController: IBoardController<Checker>,
        private _maxDepth = 1) {
        this._rankMap = moveRankMap;
        this._aiMoves = new AiMovesDescriptor();
    }

    private calc() {
        this.aiMoveRunner(1, undefined);
    }

    private aiMoveRunner(depth: number, parent: AiMoveDescriptorItem): AiMoveDescriptorItem[] {
        if (this._maxDepth < depth) {
            return;
        }
        const possibleMoves = this.getPosiibleMoves(this._players.current)
            .map(move => new AiMoveDescriptorItem(move, parent));

        possibleMoves.forEach(move => {
            this._boardController.doMove(move);
            const counterMove = this.getPosiibleMoves(this._players.opponent);
            const bestCouterMove = counterMove.reduce((prev, current) => this._rankMap[prev.type] > this._rankMap[current.type] ? prev : current);
            move.counterMove = bestCouterMove;
            this._players.switch();
            this._boardController.doMove(bestCouterMove);
            move.boardState = this._board.immutableCells;
            this._aiMoves.add(move, depth === 1);
            this.aiMoveRunner(depth++, move);
        });
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