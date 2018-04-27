import { Board } from "../board/board";
import { IIdentible } from "./i-Identible";
import { MoveDescriptor } from "../descriptor/move-descriptor";

export interface IMoveValidator<T extends IIdentible> {
    validate(moveDescriptor:MoveDescriptor, board: Board<T>): boolean
}

export interface IMoveValidatorInterceptor<T extends IIdentible> extends IMoveValidator<T> {
    error?:string;
}