import { PositionDefinition } from "../board/position";
import { MoveType } from "../move/move-type";

export interface IMoveAnalyzer{
    getMoveType(from: PositionDefinition, to: PositionDefinition): MoveType;
}