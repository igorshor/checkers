import { PositionDefinition, IPosition } from "../board/position";
import { MoveType } from "../move/move-type";
import { MoveDescriptor } from "../move/move-descriptor";
import { SelectDescriptor } from "../move/select-descriptor";

export interface IMoveAnalyzer{
    getMoveType(from: PositionDefinition, to: PositionDefinition): MoveType;
    getPosibleMoves(select: SelectDescriptor):MoveDescriptor[];
    getNextPositionByDirection(move: MoveDescriptor): IPosition
}