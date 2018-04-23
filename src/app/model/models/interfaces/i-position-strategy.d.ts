import { PositionType } from "../board/position-type";
import { PositionDefinition } from "../board/position";

export interface IPositionStrategy {
    getCellTypeByPosition(position: PositionDefinition): PositionType;
    getPlayerByPosition(positionType:PositionType, position: PositionDefinition): any;
    includeInGame(positionType:PositionType):boolean;
}