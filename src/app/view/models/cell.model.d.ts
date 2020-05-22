import { PositionType } from "../../model/common/board/position-type";
import { IPosition } from "../../model/common/board/position";

export interface Cell {
    id: string;
    type: PositionType;
    playerId?: string;
    position: IPosition
    prediction?: boolean;
    movable?: boolean;
    isKink?: boolean;
    selected?: boolean;
}