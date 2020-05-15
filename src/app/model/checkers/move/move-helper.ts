import { DirectionsDefinition, MoveDirectionsDefinition } from "../../common/move/move-direction";
import { IPosition } from "../../common/board/position";
import { Constants } from "../../constants";

export class MoveHelper {
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

    public static getMoveDirection(a: IPosition, b: IPosition): MoveDirectionsDefinition {
        const direction = (a.y - b.y) > 0 ? DirectionsDefinition.Up : DirectionsDefinition.Down;
        const horizontal = (a.x - b.x) > 0 ? DirectionsDefinition.Left : DirectionsDefinition.Right;

        return direction | horizontal;
    }

    public static getDistance(a: IPosition, b: IPosition): number {
        return Math.abs(a.y - b.y);
    }

    public static getDistanceToBoundaries(pos: IPosition, oponnentBase: number): number {
        return Math.abs(oponnentBase - pos.y);
    }
    
    public static isSamePosition(a: IPosition, b: IPosition): boolean {
        return a.x === b.x && a.y === b.y;
    }
}