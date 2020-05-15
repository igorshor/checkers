import { MoveType } from "../move/move-type";
import { MoveDescriptor } from "../descriptor/move-descriptor";
import { Board } from "../board/board";
import { IIdentible } from "./i-Identible";
import { Cell } from "../board/cell";
import { IPosition } from "../board/position";
import { IMoveAnalyzer } from "./i-move-analyzer";
import { Players } from "../player/players";

export interface IMoveTypeStrategy<T extends IIdentible> {
    getGeneralMoveType(moveDescriptor: MoveDescriptor, board: Board<T>): MoveType;
    getPossibleNextPositions(fromCell: Cell<T>, moveAnalizer: IMoveAnalyzer<T>, playersManager: Players<T>): IPosition[]
}