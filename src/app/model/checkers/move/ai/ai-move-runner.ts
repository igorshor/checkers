import { IMoveAnalyzer } from "../../../common/interfaces/i-move-analyzer";
import { Checker } from "../../board/checker";
import { Board } from "../../../common/board/board";
import { Players } from "../../../common/player/players";
import { AiMoveDescriptor } from "./ai-move-descriptor";
import { IMovePicker } from "../../interfaces/i-move-picker";
import AiRunnerWorker from "worker-loader!../../../workers/checkers/ai-move-worker";
import { MoveDescriptor } from "../../../common/descriptor/move-descriptor";
import { BoardController } from "../../board/board-controller";

export class AiMoveRunner {
    private _root: AiMoveDescriptor;

    constructor(private _moveAnalizer: IMoveAnalyzer<Checker>,
        private _players: Players<Checker>,
        board: Board<Checker>,
        private _movePicker: IMovePicker,
        private _maxDepth = 1) {
        this._root = this.getAiRootElement();
        this._root.boardImage = board.immutableBoard;
    }

    async calculate(): Promise<AiMoveDescriptor> {
        await this.aiMoveRunner(1, this._root);
        return this._root;
    }

    private aiMoveRunner(depth: number, parent: AiMoveDescriptor): AiMoveDescriptor[] {
        if (this._maxDepth < depth) {
            return;
        }

        const board = parent.boardImage;
        const boardController = new BoardController(board, this._moveAnalizer, this._players);
        const possibleMoves = this._moveAnalizer.getPossibleMovesByPlayer(this._players.current, board)
            .map(move => new AiMoveDescriptor(move, parent));

        possibleMoves.forEach(move => {
            move.depth = depth;
            boardController.doMove(move);
            this._players.switch();
            move.boardImage = board.immutableBoard;
            const counterMove = this._moveAnalizer.getPossibleMovesByPlayer(this._players.current, board);
            const bestCouterMove = this._movePicker.calcBestMove(counterMove);
            move.counterMove = bestCouterMove;
            boardController.doMove(bestCouterMove);
            this._players.switch();
            move.boardImage = board.immutableBoard;
            parent.add(move);
            //const worker: Worker = new AiRunnerWorker();
            this.aiMoveRunner(depth + 1, move);

            boardController.undoMove(bestCouterMove);
            boardController.undoMove(move);
        });
    }

    private getAiRootElement(): AiMoveDescriptor {
        const moveDescriptor = new MoveDescriptor({ x: undefined, y: undefined }, { x: undefined, y: undefined }, undefined, undefined);
        const aiMoveDescriptor = new AiMoveDescriptor(moveDescriptor, undefined);
        aiMoveDescriptor.depth = 0;
        return aiMoveDescriptor
    }
}