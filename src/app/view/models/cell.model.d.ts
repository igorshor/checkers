import { Position } from "./position.model";

export interface Cell {
    playerId?: string;
    position: Position
}