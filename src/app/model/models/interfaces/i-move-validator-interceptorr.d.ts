import { MoveDescriptor } from "../move/move-descriptor";
import { Board } from "../board/board";

export interface IMoveValidator<T> {
    validate(moveDescriptor:MoveDescriptor, board: Board<T>): boolean
}

export interface IMoveValidatorInterceptor<T> extends IMoveValidator<T> {
    error?:string;
}