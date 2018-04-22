import { IMoveValidatorInterceptor } from "../../interfaces/i-move-validator-interceptorr";
import { MoveDescriptor } from "../move-descriptor";
import { Board } from "../../board/board";

export class BoundariesValidator implements IMoveValidatorInterceptor {
    error = 'the move is outside the board bonderies';

    validate(moveDescriptor: MoveDescriptor, board: Board): boolean {
        throw new Error("Method not implemented.");
    }
}