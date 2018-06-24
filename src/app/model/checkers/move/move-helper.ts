import { DirectionsDefinition, MoveDirectionsDefinition } from "../../common/move/move-direction";
import { IPosition } from "../../common/board/position";

export class MoveHelper {
    public static getMaxPossibleNextMovePositionsCount(moveDirection: MoveDirectionsDefinition, pos: IPosition, posibleMax: number, max = Number.MAX_SAFE_INTEGER): number {
        let numberOfPosibleMoves = 0;

        if (moveDirection & DirectionsDefinition.Right) {
            numberOfPosibleMoves = pos.x + 1;
        } else if (moveDirection & DirectionsDefinition.Left) {
            numberOfPosibleMoves = Math.abs(posibleMax - pos.x);
        }

        return Math.min(numberOfPosibleMoves, max);
    }

    public static simulateNextCellByDirection(position: IPosition, moveDirection: MoveDirectionsDefinition): IPosition {
        const pos = { x: position.x, y: position.y };

        if (moveDirection & DirectionsDefinition.Up) {
            pos.y--;
        }

        if (moveDirection & DirectionsDefinition.Down) {
            pos.y++;
        }

        if (moveDirection & DirectionsDefinition.Right) {
            pos.x++;
        }

        if (moveDirection & DirectionsDefinition.Left) {
            pos.x--;
        }

        if (position.x === pos.x || position.y === pos.y) {
            throw new Error('position simulation problem');
        }

        return pos;
    }

    public static getMoveDirection(a: IPosition, b: IPosition) {
        const direction = (a.y - b.y) > 0 ? DirectionsDefinition.Up : DirectionsDefinition.Down;
        const horizontal = (a.x - b.x) > 0 ? DirectionsDefinition.Left : DirectionsDefinition.Right;

        return direction | horizontal;
    }

    public static getDistance(a: IPosition, b: IPosition): number {
        return Math.abs(a.y - b.y);
    }
}