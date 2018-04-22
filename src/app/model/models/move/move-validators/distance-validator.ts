import { IMoveValidatorInterceptor } from "../../interfaces/i-move-validator-interceptorr";
import { MoveDescriptor } from "../move-descriptor";
import { Board } from "../../board/board";

export class DistanceValidator implements IMoveValidatorInterceptor {
    error = 'invalid distance';
    
    validate(moveDescriptor: MoveDescriptor, board: Board): boolean {
        throw new Error("Method not implemented.");
    }
}