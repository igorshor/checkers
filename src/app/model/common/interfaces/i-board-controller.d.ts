import { IIdentible } from "./i-Identible";
import { Cell } from "../board/cell";
import { MoveDescriptor } from "../descriptor/move-descriptor";
import { Board } from "../board/board";

export interface IBoardController<T extends IIdentible> {
    readonly board: Board<T>;
    doMove(moveDescriptor: MoveDescriptor, customBoard?: Board<T>): Cell<T>[];
    undoMove(moveDescriptor: MoveDescriptor, customBoard?: Board<T>): Cell<T>[];
}