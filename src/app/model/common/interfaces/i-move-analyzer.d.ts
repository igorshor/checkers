import { IPosition } from "../board/position";
import { MoveType } from "../move/move-type";
import { MoveDescriptor } from "../descriptor/move-descriptor";
import { SelectDescriptor } from "../descriptor/select-descriptor";
import { Board } from "../board/board";
import { IIdentible } from "./i-Identible";
import { MoveDirectionsDefinition } from "../move/move-direction";
import { Player } from "../player/player";

export interface IMoveAnalyzer<T extends IIdentible> {
    getGeneralMoveType(from: IPosition, to: IPosition, board: Board<T>): MoveType;
    getSpecificMoveType(from: IPosition, to: IPosition, board: Board<T>): MoveType;
    getPossibleMovesBySelect(select: SelectDescriptor, board: Board<T>): MoveDescriptor[];
    getPossibleMovesByPlayer(player: Player<T>, board: Board<T>): MoveDescriptor[];
    getNextPositionByDirection(position: IPosition, moveDirection: MoveDirectionsDefinition, board: Board<T>, forceNext?:boolean): IPosition;
    isKingMove(moveDescriptor:MoveDescriptor): boolean;
}