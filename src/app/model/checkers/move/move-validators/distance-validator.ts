import { Checker } from "../../board/checker";
import { IMoveValidatorInterceptor } from "../../../common/interfaces/i-move-validator-interceptorr";
import { MoveDescriptor } from "../../../common/descriptor/move-descriptor";
import { Board } from "../../../common/board/board";

export class DistanceValidator implements IMoveValidatorInterceptor<Checker> {
    error = 'invalid distance';

    validate(moveDescriptor: MoveDescriptor, board: Board<Checker>): boolean {
        const dist = Math.abs(moveDescriptor.from.y - moveDescriptor.to.y);
        return dist > 0 && dist <= 2;
    }
}