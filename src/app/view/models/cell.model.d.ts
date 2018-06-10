import { Position } from "./position.model";
import { CellType } from "./cell-type.model";

export interface Cell {
    id: string;
    type: CellType;
    playerId?: string;
    position: Position
}