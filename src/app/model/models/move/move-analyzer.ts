import { PositionDefinition, IPosition } from "../board/position";
import { MoveType } from "./move-type";
import { IMoveAnalyzer } from "../interfaces/i-move-analyzer";
import { Board } from "../board/board";
import { MoveDescriptor } from "./move-descriptor";
import { MoveDirectionsDefinition, DirectionsDefinition } from "./move-direction";
import { CheckerState } from "../board/checker-state";

interface IFromTo<T> {
    from: T;
    to: T;
}

interface IRectangle {
    x: IFromTo<number>;
    y: IFromTo<number>;

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

    breakeDownMove(move: MoveDescriptor): MoveDescriptor[] {
        if (!move.type) {
            move.type = this.getMoveType(move.from, move.to);
        }

        if (move.type === MoveType.Move) {
            return [];
        }

        const moves: MoveDescriptor[] = [];
        const player = this._board.getCellByPosition(move.from).checker.id;
        let nextPos: IPosition = { x: 0, y: 0 };

        while (nextPos.x === move.to.x && nextPos.y === move.to.y) {
            nextPos = this.getNextPositionByDirection(move)
        }
    }

    getPossibleRoutes(move: MoveDescriptor): IFromTo<IPosition>[][] {
        const playGround = this.getMaxRectangle(move);
        const fromChecker = this._board.getCellByPosition(move.from).checker
        if (this.isSingleEatRecDistanceRec(playGround)) {
            return [[{ from: move.from, to: move.to }]];
        }

        if(fromChecker.state === CheckerState.King){
            //Todo
        } else {
            if(this.isOneDirectionEatRoutDistanceRec(playGround)){
                //todo
            }
        }
    }

    private isSingleEatRecDistanceRec(playGround: IRectangle) {
        return Math.abs(playGround.x.from - playGround.x.to) === MoveAnalyzer.singleEatRecDistance &&
            Math.abs(playGround.y.from - playGround.y.to) === MoveAnalyzer.singleEatRecDistance
    }

    private isOneDirectionEatRoutDistanceRec(playGround: IRectangle) {
        return Math.abs(playGround.x.from - playGround.x.to) === MoveAnalyzer.singleEatRecDistance &&
            Math.abs(playGround.y.from - playGround.y.to) === MoveAnalyzer.singleEatRecDistance
    }

    private getMaxRectangle(move: MoveDescriptor): IRectangle {
        return {
            x: {
                from: move.from.x < move.to.x ? move.from.x : move.to.x,
                to: move.from.x > move.to.x ? move.from.x : move.to.x,
            },
            y: {
                from: move.from.y < move.to.y ? move.from.y : move.to.y,
                to: move.from.y > move.to.y ? move.from.y : move.to.y,
            }
        }
    }

    getNextPositionByDirection(move: MoveDescriptor): IPosition {
        const pos = { x: move.from.x, y: move.from.y };

        if (move.direction & DirectionsDefinition.Up) {
            pos.y++;
        }

        if (move.direction & DirectionsDefinition.Down) {
            pos.y--;
        }

        if (move.direction & DirectionsDefinition.Right) {
            pos.x++;
        }

        if (move.direction & DirectionsDefinition.Left) {
            pos.x--;
        }

        return pos;
    }

    private getDistance(from: PositionDefinition, to: PositionDefinition) {
        return Math.abs(from.y - to.y);
    }
}