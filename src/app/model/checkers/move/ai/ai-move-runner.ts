import { IMoveAnalyzer } from "../../../common/interfaces/i-move-analyzer";
import { Checker } from "../../board/checker";
import { Board } from "../../../common/board/board";
import { Players } from "../../../common/player/players";
import { IBoardController } from "../../../common/interfaces/i-board-controller";
import { AiMoveDescriptor } from "./ai-move-descriptor";
import { IMovePicker } from "../../interfaces/i-move-picker";
import AiRunnerWorker from "worker-loader!../../../workers/checkers/ai-move-worker";
import { MoveDescriptor } from "../../../common/descriptor/move-descriptor";

export class AiMoveRunner {
    private _root: AiMoveDescriptor;

    constructor(private _moveAnalizer: IMoveAnalyzer<Checker>,
        private _players: Players<Checker>,
        board: Board<Checker>,
        private _boardController: IBoardController<Checker>,
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
        const possibleMoves = this._moveAnalizer.getPossibleMovesByPlayer(this._players.current, board)
            .map(move => new AiMoveDescriptor(move, parent));

        possibleMoves.forEach(move => {
            this._boardController.doMove(move);
            move.boardImage = board.immutableBoard;
            const counterMove = this._moveAnalizer.getPossibleMovesByPlayer(this._players.opponent, board);
            const bestCouterMove = this._movePicker.calcBestMove(counterMove);
            move.counterMove = bestCouterMove;
            this._players.switch();
            this._boardController.doMove(bestCouterMove);
            move.boardImage = board.immutableBoard;
            this._root.add(move);
            //const worker: Worker = new AiRunnerWorker();
            this.aiMoveRunner(depth++, move);
        });
    }

    private getAiRootElement(): AiMoveDescriptor {
        return new AiMoveDescriptor(new MoveDescriptor({ x: undefined, y: undefined }, { x: undefined, y: undefined }, undefined, undefined), undefined);
    }
}