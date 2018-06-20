import { Board } from "../board/board";
import { IIdentible } from "./i-Identible";
import { MoveDescriptor } from "../descriptor/move-descriptor";
import { Player } from "../player/player";
import { IMoveAnalyzer } from "./i-move-analyzer";

export interface IMoveValidator<T extends IIdentible> {
    validate(moveDescriptor: MoveDescriptor, board: Board<T>, player: Player<T>, moveAnalizer: IMoveAnalyzer<T>): boolean
}

export interface IMoveValidatorInterceptor<T extends IIdentible> extends IMoveValidator<T> {
    error?: string;
}