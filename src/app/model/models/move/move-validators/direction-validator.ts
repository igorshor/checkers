import { IMoveValidatorInterceptor } from "../../interfaces/i-move-validator-interceptorr";
import { MoveDescriptor } from "../move-descriptor";
import { Board } from "../../board/board";

export class DirectionValidator implements IMoveValidatorInterceptor {
    error = 'invalid direction'
    validate(moveDescriptor: MoveDescriptor, board: Board): boolean {
        throw new Error("Method not implemented.");
    }
}