import { PositionType } from "../board/position-type";
import { IPosition } from "../board/position";

export interface IPositionStrategy {
    getCellTypeByPosition(position: IPosition): PositionType;
    getPlayerByPosition(positionType: PositionType, position: IPosition): any;
    includeInGame(positionType: PositionType): boolean;
}