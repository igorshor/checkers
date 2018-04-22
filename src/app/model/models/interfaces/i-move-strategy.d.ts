import { PositionDefinition } from "../board/position";

export interface IMoveStrategy{
    move(from:PositionDefinition, to:PositionDefinition):boolean;
}