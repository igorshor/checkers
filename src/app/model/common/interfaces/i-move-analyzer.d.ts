import { PositionDefinition, IPosition } from "../board/position";
import { MoveType } from "../move/move-type";
import { MoveDescriptor } from "../descriptor/move-descriptor";
import { SelectDescriptor } from "../descriptor/select-descriptor";
import { Board } from "../board/board";
import { IIdentible } from "./i-Identible";

export interface IMoveAnalyzer<T extends IIdentible> {
    getMoveType(from: PositionDefinition, to: PositionDefinition): MoveType;
    getPosibleMoves(select: SelectDescriptor, board?: Board<T>): MoveDescriptor[];
    getNextPositionByDirection(move: MoveDescriptor): IPosition
}