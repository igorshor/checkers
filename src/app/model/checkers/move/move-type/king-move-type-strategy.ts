import { Checker } from "../../board/checker";
import { IMoveTypeStrategy } from "../../../common/interfaces/i-move-type-strategy";
import { MoveType } from "../../../common/move/move-type";
import { Board } from "../../../common/board/board";
import { MoveDescriptor } from "../../../common/descriptor/move-descriptor";
import { MoveHelper } from "../../../common/move/move-helper";
import { Cell } from "../../../common/board/cell";
import { IMoveAnalyzer } from "../../../common/interfaces/i-move-analyzer";
import { IPosition } from "../../../common/board/position";
import { Players } from "../../../common/player/players";


type MoveRunnerCallbackType = (currCell: Cell<Checker>, index: number, fromCell?: Cell<Checker>, toCell?: Cell<Checker>) => boolean;

export class KingMoveTypeStrategy implements IMoveTypeStrategy<Checker> {
    isMoveRunner(moveDescriptor: MoveDescriptor, board: Board<Checker>, defaultReturn: boolean, iterabale: MoveRunnerCallbackType) {
        const fromCell = board.getCellByPosition(moveDescriptor.from);
        const toCell = board.getCellByPosition(moveDescriptor.to);
        const direction = MoveHelper.getMoveDirection(moveDescriptor.from, moveDescriptor.to);
        let index = 0;
        let pos = moveDescriptor.from;

        if (toCell?.element) {
            return false;
        }

        while (!MoveHelper.isSamePosition(moveDescriptor.to, pos = MoveHelper.simulateNextCellByDirection(pos, direction))) {
            const cell = board.getCellByPosition(pos);

            const conclusion = iterabale(cell, ++index, fromCell, toCell);

            if (conclusion === true || conclusion === false) {
                return conclusion;
            }
        }

        return defaultReturn;
    }

    isGeneralAttack(moveDescriptor: MoveDescriptor, board: Board<Checker>): boolean {
        let atackCounter = 0;

        return this.isMoveRunner(moveDescriptor, board, true, (currCell, index, fromCell) => {
            if (!currCell) {
                return false;
            }

            if (currCell.element) {
                if (fromCell.element.correlationId !== currCell.element.correlationId) {
                    atackCounter += 1;
                } else {
                    return false;
                }

                if (atackCounter > 1) {
                    return false;
                }
            }
        })
    }

    isGeneralMove(moveDescriptor: MoveDescriptor, board: Board<Checker>): boolean {
        return this.isMoveRunner(moveDescriptor, board, true, (currCell, index) => {
            if (!currCell) {
                return false;
            }

            if (currCell.element) {
                return false;
            }
        })
    }
    
    getGeneralMoveType(moveDescriptor: MoveDescriptor, board: Board<Checker>): MoveType {
        const distance = MoveHelper.getDistance(moveDescriptor.from, moveDescriptor.to);
        const isGeneralAttack = this.isGeneralAttack(moveDescriptor, board);

        if (!distance) {
            throw new Error('invalid move');
        }

        if (isGeneralAttack) {
            return MoveType.Attack;
        }
        
        return this.isGeneralMove(moveDescriptor, board) ? MoveType.Move : MoveType.Invalid;
    }

    getPossibleNextPositions(fromCell: Cell<Checker>, moveAnalizer: IMoveAnalyzer<Checker>, playersManager: Players<Checker>): IPosition[] {
        return moveAnalizer.getPossibleNextMovePositions(fromCell.position, fromCell.element.directions,moveAnalizer.getMaxDistanceToBoundaries(fromCell.position));
    }
}