import { Board } from "./board";
import { MoveDescriptor } from "./move/move-descriptor";

export interface IMoveValidator {
    validate(moveDescriptor:MoveDescriptor, board: Board): boolean
}

export interface IMoveValidatorInterceptor extends IMoveValidator {
    error?:string;
}