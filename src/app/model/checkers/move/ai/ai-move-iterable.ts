import { MoveDescriptor } from "../../../common/descriptor/move-descriptor";
import { IMoveAnalyzer } from "../../../common/interfaces/i-move-analyzer";
import { PlayersManager } from "../../../common/player/players-manager";
import { Checker } from "../../board/checker";
import { Board } from "../../../common/board/board";
import { SelectDescriptor } from "../../../common/descriptor/select-descriptor";

export class AiMoveIterable implements Iterable<MoveDescriptor[]> {
    private _depth: number;
    constructor(private _moveAnalizer: IMoveAnalyzer<Checker>,
        private _playersManager: PlayersManager<Checker>,
        private _board: Board<Checker>,
        private _moveDepth: number) {
        this._depth = 1;
    }

    *[Symbol.iterator](): IterableIterator<MoveDescriptor[]> {
        if (this._moveDepth < this._depth) {
            return;
        }

        const playerCells = this._board.select(cell => cell.element && cell.element.id === this._playersManager.current.id);
        let possibleMoves: MoveDescriptor[];
        playerCells.forEach(cell => {
            const select = new SelectDescriptor(cell.position, this._playersManager.current.id, cell.element.id, this._playersManager.current.direction);
            possibleMoves = this._moveAnalizer.getPossibleMoves(select, this._board);
        });

        yield possibleMoves;
    }
}