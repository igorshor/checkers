import { DirectionsDefinition, MoveDirectionsDefinition } from "./move-direction";
import { IPosition } from "../board/position";
import { MoveType } from "./move-type";
import { PositionHelper } from "../board/position-helper";

export class MoveHelper {
    public static simulateNextCellByDirection(position: IPosition, moveDirection: MoveDirectionsDefinition): IPosition {
        const pos = { x: position.x, y: position.y };

        if (moveDirection & DirectionsDefinition.Up) {
            pos.y++;
        }

        if (moveDirection & DirectionsDefinition.Down) {
            pos.y--;
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

    public static getVerticalDirection(a: number, b: number): DirectionsDefinition {
        const direction = (a - b) < 0 ? DirectionsDefinition.Up : DirectionsDefinition.Down;

        return direction;
    }

    
    public static getHorizontalDirection(a: number, b: number): DirectionsDefinition {
        const direction = (a - b) > 0 ? DirectionsDefinition.Left : DirectionsDefinition.Right;

        return direction;
    }

    public static getMoveDirection(a: IPosition, b: IPosition): MoveDirectionsDefinition {
        const direction = this.getVerticalDirection(a.y, b.y)
        const horizontal = this.getHorizontalDirection(a.x, b.x)

        return direction | horizontal; 
    }

    public static getDistance(a: IPosition, b: IPosition): number {
        return Math.abs(a.y - b.y);
    }
    
    public static isAtack(type: MoveType) {
        return type === MoveType.Attack || type === MoveType.AttackDanger;
    }

    private static ID_MOVE_SEPERATOR = '->';


    public static getId(a: IPosition, b: IPosition) {
        return PositionHelper.getPositionId(a) + this.ID_MOVE_SEPERATOR + PositionHelper.getPositionId(b)
    }
}