import { PositionType } from "./position-type";
import { PositionDefinition } from "./position";

export interface IPositionStrategy {
    getCellTypeByPosition(position: PositionDefinition): PositionType;
    getPlayerByPosition(positionType:PositionType, position: PositionDefinition): any;
    includeInGame(positionType:PositionType):boolean;
}