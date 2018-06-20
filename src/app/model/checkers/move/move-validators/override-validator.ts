import { Checker } from "../../board/checker";
import { IMoveValidatorInterceptor } from "../../../common/interfaces/i-move-validator-interceptorr";
import { MoveDescriptor } from "../../../common/descriptor/move-descriptor";
import { Board } from "../../../common/board/board";

export class OverrideValidator implements IMoveValidatorInterceptor<Checker> {
    error = 'Tying to over ride another checker';

    validate(moveDescriptor: MoveDescriptor, board: Board<Checker>): boolean {
        const destinationCell = board.getCellByPosition(moveDescriptor.to);
        return !destinationCell.element;
    }
}