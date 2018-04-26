import { MoveDescriptor } from "../move/move-descriptor";
import { Board } from "../board/board";
import { IIdentible } from "./i-Identible";

export interface IMoveValidator<T extends IIdentible> {
    validate(moveDescriptor:MoveDescriptor, board: Board<T>): boolean
}

export interface IMoveValidatorInterceptor<T extends IIdentible> extends IMoveValidator<T> {
    error?:string;
}