import { IMoveValidatorInterceptor } from "../../interfaces/i-move-validator-interceptorr";
import { MoveDescriptor } from "../move-descriptor";
import { Board } from "../../board/board";
import { Checker } from "../../board/checker";

export class DistanceValidator implements IMoveValidatorInterceptor<Checker> {
    error = 'invalid distance';

    validate(moveDescriptor: MoveDescriptor, board: Board<Checker>): boolean {
        throw new Error("Method not implemented.");
    }
}