import { Checker } from "../../board/checker";
import { IMoveValidatorInterceptor } from "../../../common/interfaces/i-move-validator-interceptorr";
import { MoveDescriptor } from "../../../common/descriptor/move-descriptor";
import { Board } from "../../../common/board/board";

export class DistanceValidator implements IMoveValidatorInterceptor<Checker> {
    error = 'invalid distance';

    validate(moveDescriptor: MoveDescriptor, board: Board<Checker>): boolean {
        throw new Error("Method not implemented.");
    }
}