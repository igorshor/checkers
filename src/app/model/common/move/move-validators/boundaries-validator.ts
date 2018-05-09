import { IMoveValidatorInterceptor } from "../../interfaces/i-move-validator-interceptorr";
import { Board } from "../../board/board";
import { MoveDescriptor } from "../../descriptor/move-descriptor";
export class BoundariesValidator implements IMoveValidatorInterceptor<any> {
    error = 'the move is outside the board bonderies';

    validate(moveDescriptor: MoveDescriptor, board: Board<any>): boolean {
        return moveDescriptor.to.x <= board.size || moveDescriptor.to.y <= board.size;
    }
}