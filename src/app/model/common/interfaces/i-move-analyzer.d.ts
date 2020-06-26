import { IPosition } from "../board/position";
import { MoveType } from "../move/move-type";
import { MoveDescriptor } from "../descriptor/move-descriptor";
import { SelectDescriptor } from "../descriptor/select-descriptor";
import { Board } from "../board/board";
import { IIdentible } from "./i-Identible";
import { MoveDirectionsDefinition, DirectionsDefinition } from "../move/move-direction";
import { Player } from "../player/player";
import { IMoveTypeStrategy } from "./i-move-type-strategy";
import { Cell } from "../board/cell";

export interface IMoveAnalyzer<T extends IIdentible>  {
    getMaxDistanceToBoundaries(pos: IPosition): number;
    getGeneralMoveType: IMoveTypeStrategy<T>['getGeneralMoveType'];
    getSpecificMoveType(moveDescriptor: MoveDescriptor, board: Board<T>): MoveType;
    getPossibleMovesByCell(fromCell: Cell<T>, board: Board<T>, searchTypes?: MoveType[]): MoveDescriptor[];
    getPossibleMovesBySelect(select: SelectDescriptor, board: Board<T>): MoveDescriptor[];
    getPossibleMovesByPlayer(player: Player<T>, board: Board<T>): MoveDescriptor[];
    getNextPositionByDirection(position: IPosition, moveDirection: MoveDirectionsDefinition, board: Board<T>, forceNext?:boolean): IPosition;
    getPossibleNextMovePositions(position: IPosition, attackDirections: DirectionsDefinition[], moves: number): IPosition[]
    isAKing(moveDescriptor: MoveDescriptor): boolean;
}