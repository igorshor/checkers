import { Position } from "./position.model";
import { PositionType } from "../../model/common/board/position-type";

export interface Cell {
    id: string;
    type: PositionType;
    playerId?: string;
    position: Position
    prediction?: boolean;
    superMode?: boolean;
}