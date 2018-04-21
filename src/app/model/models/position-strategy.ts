import { Position } from './position'
import { PositionType } from './position-type';
export abstract class PositionStrategy {
    constructor(protected _size:number, protected _ids: any[]) {

    }

    public getCellTypeByPosition(position: Position): PositionType {
        if (position.x % 2 === 0 && position.y % 2 === 0 ||
            position.x % 2 === 1 && position.y % 2 === 1) {
            return PositionType.Black;
        }

        return PositionType.White;
    }
    public abstract getPlayerByPosition(positionType:PositionType, position: Position): any;
    public abstract includeInGame(positionType:PositionType):boolean;
}

