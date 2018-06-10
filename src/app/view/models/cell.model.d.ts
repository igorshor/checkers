import { Position } from "./position.model";
export enum CellType {
    Black,
    White
}

export interface Cell {
    id: string;
    type: CellType;
    playerId?: string;
    position: Position
}