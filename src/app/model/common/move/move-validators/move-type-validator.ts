import { IMoveValidatorInterceptor } from "../../interfaces/i-move-validator-interceptorr";
import { Board } from "../../board/board";
import { MoveDescriptor } from "../../descriptor/move-descriptor";
import { MoveType } from "../move-type";
export class MoveTypeValidator implements IMoveValidatorInterceptor<any> {
    error = 'move type not valid';

    validate(moveDescriptor: MoveDescriptor): boolean {
        return moveDescriptor.type !== MoveType.Invalid;
    }
}