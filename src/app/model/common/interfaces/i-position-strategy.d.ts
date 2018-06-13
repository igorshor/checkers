import { PositionType } from "../board/position-type";
import { IPosition } from "../board/position";
import { Player } from "../player/player";
import { IIdentible } from "./i-Identible";

export interface IPositionStrategy<T extends IIdentible> {
    getCellTypeByPosition(position: IPosition): PositionType;
    getPlayerByPosition(positionType: PositionType, players: Player<T>[], position: IPosition): string;
    includeInGame(positionType: PositionType): boolean;
}