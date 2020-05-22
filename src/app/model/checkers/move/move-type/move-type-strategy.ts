import { Checker } from "../../board/checker";
import { IMoveTypeStrategy } from "../../../common/interfaces/i-move-type-strategy";
import { MoveType } from "../../../common/move/move-type";
import { Board } from "../../../common/board/board";
import { MoveDescriptor } from "../../../common/descriptor/move-descriptor";
import { MoveHelper } from "../../../common/move/move-helper";
import { Cell } from "../../../common/board/cell";
import { IMoveAnalyzer } from "../../../common/interfaces/i-move-analyzer";
import { Players } from "../../../common/player/players";
import { IPosition } from "../../../common/board/position";

const ATTACK_DISTANCE = 2;
const MOVE_DISTANCE = 1;

export class MoveTypeStrategy implements IMoveTypeStrategy<Checker> {
    isGeneralAttack(moveDescriptor: MoveDescriptor, board: Board<Checker>): boolean {
        const fromCell = board.getCellByPosition(moveDescriptor.from);
        
        const pos = MoveHelper.simulateNextCellByDirection(moveDescriptor.from, moveDescriptor.moveDirection);
        const cell = board.getCellByPosition(pos);

        return cell && cell.element && fromCell.element.correlationId !== cell.element.correlationId;
    }

    isGeneralMove(moveDescriptor: MoveDescriptor, board: Board<Checker>): boolean {
        const distance = MoveHelper.getDistance(moveDescriptor.from, moveDescriptor.to);

        return distance === MOVE_DISTANCE;
    }

    getGeneralMoveType(moveDescriptor: MoveDescriptor, board: Board<Checker>): MoveType {
        const distance = MoveHelper.getDistance(moveDescriptor.from, moveDescriptor.to);
        const fromCell = board.getCellByPosition(moveDescriptor.from);

        if (distance === MOVE_DISTANCE) {
            return this.isGeneralMove(moveDescriptor, board) ? MoveType.Move : MoveType.Invalid;
        } else if (distance === ATTACK_DISTANCE) {
            return this.isGeneralAttack(moveDescriptor, board) ? MoveType.Attack : MoveType.Invalid;
        } else {
            throw new Error('invalid move');
        }
    }

    getPossibleNextPositions(fromCell: Cell<Checker>, moveAnalizer: IMoveAnalyzer<Checker>, playersManager: Players<Checker>): IPosition[] {
        return moveAnalizer.getPossibleNextMovePositions(fromCell.position, [playersManager.current.direction], ATTACK_DISTANCE);
    }
}