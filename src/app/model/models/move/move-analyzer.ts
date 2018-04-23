import { PositionDefinition, IPosition } from "../board/position";
import { MoveType } from "./move-type";
import { IMoveAnalyzer } from "../interfaces/i-move-analyzer";
import { Board } from "../board/board";
import { MoveDescriptor } from "./move-descriptor";
import { MoveDirectionsDefinition, DirectionsDefinition } from "./move-direction";
import { CheckerState } from "../board/checker-state";
import { SelectDescriptor } from "./select-descriptor";

interface IFromTo<T> {
    from: T;
    to: T;
}

export class MoveAnalyzer implements IMoveAnalyzer {
    private static readonly singleEatRecDistance = 2;

    constructor(private _board: Board) {

    }

    getMoveType(from: PositionDefinition, to: PositionDefinition): MoveType {
        const distance = this.getDistance(from, to);

        if (distance === 1) {
            return MoveType.Move;
        } else {
            return MoveType.Eat;
        }
    }

    getPosibleMoves(select: SelectDescriptor):MoveDescriptor[]{
        const fromChecker = this._board.getCellByPosition(select.from).checker
        const moves:MoveDescriptor[] = [];
        if(fromChecker.state === CheckerState.King){
            //Todo
        } else {
            //Todo
        }

        return moves;
    }

    getNextPositionByDirection(move: MoveDescriptor): IPosition {
        const pos = { x: move.from.x, y: move.from.y };

        if (move.moveDirection & DirectionsDefinition.Up) {
            pos.y++;
        }

        if (move.moveDirection & DirectionsDefinition.Down) {
            pos.y--;
        }

        if (move.moveDirection & DirectionsDefinition.Right) {
            pos.x++;
        }

        if (move.moveDirection & DirectionsDefinition.Left) {
            pos.x--;
        }

        return pos;
    }

    private getDistance(from: PositionDefinition, to: PositionDefinition) {
        return Math.abs(from.y - to.y);
    }
}