import { IPosition } from "./position";

export class PositionHelper {
    static getPositionId(position: IPosition): string {
        return '(' + position.x + ',' + position.y + ')'
    }

    public static isSamePosition(a: IPosition, b: IPosition): boolean {
        return a.x === b.x && a.y === b.y;
    }
}