import { DirectionsDefinition, MoveDirectionsDefinition } from "../../common/move/move-direction";
import { IPosition } from "../../common/board/position";

export class MoveHelper{
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
}