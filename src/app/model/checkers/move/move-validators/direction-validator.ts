import { Checker } from "../../board/checker";
import { IMoveValidatorInterceptor } from "../../../common/interfaces/i-move-validator-interceptorr";
import { MoveDescriptor } from "../../../common/descriptor/move-descriptor";
import { Board } from "../../../common/board/board";
import { PlayersManager } from "../../../common/player/players-manager";
import { Player } from "../../../common/player/player";

export class DirectionValidator implements IMoveValidatorInterceptor<Checker> {
    error = 'invalid direction';
    validate(moveDescriptor: MoveDescriptor, board: Board<Checker>, player: Player<Checker>): boolean {
        return moveDescriptor.direction === player.direction;
    }
}