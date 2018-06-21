import { Checker } from "../../board/checker";
import { IMoveValidatorInterceptor } from "../../../common/interfaces/i-move-validator-interceptorr";
import { MoveDescriptor } from "../../../common/descriptor/move-descriptor";
import { Board } from "../../../common/board/board";
import { MoveHelper } from "../move-helper";

export class DistanceValidator implements IMoveValidatorInterceptor<Checker> {
    error = 'invalid distance';

    validate(moveDescriptor: MoveDescriptor, board: Board<Checker>): boolean {
        const cell = board.getCellByPosition(moveDescriptor.from);

        if (cell.element.isKing) {
            return true;
        }

        if(moveDescriptor.isAttack){
            return moveDescriptor.distance === 2;
        }

        return moveDescriptor.distance === 1;
    }
}