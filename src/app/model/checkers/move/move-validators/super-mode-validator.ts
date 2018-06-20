import { Checker } from "../../board/checker";
import { IMoveValidatorInterceptor } from "../../../common/interfaces/i-move-validator-interceptorr";
import { MoveDescriptor } from "../../../common/descriptor/move-descriptor";
import { Board } from "../../../common/board/board";
import { MoveAnalyzer } from "../move-analyzer";
import { Player } from "../../../common/player/player";
import { Cell } from "../../../common/board/cell";

export class OverrideValidator implements IMoveValidatorInterceptor<Checker> {
    error = 'Invalid super move :o';

    validate(moveDescriptor: MoveDescriptor, board: Board<Checker>, _: Player<Checker>, moveAnalizer: MoveAnalyzer): boolean {
        const startCell = board.getCellByPosition(moveDescriptor.from);

        if (startCell.element.isPeasant) {
            return true;
        }

        const endCell = board.getCellByPosition(moveDescriptor.to);
        const midCells = this.initMidCells(startCell, endCell, moveAnalizer, moveDescriptor, board);
        const checkersInTheMiddel = this.getCheckersInTheMiddel(midCells);

        if (checkersInTheMiddel.length <= 1) {
            return true;
        }

        return this.handelMultiCheckersInTheMiddle(checkersInTheMiddel, checkersInTheMiddel);
    }

    private handelMultiCheckersInTheMiddle(midCells: Cell<Checker>[], checkersInTheMiddel: Cell<Checker>[]): boolean {
        throw new Error("Method not implemented.");
    }

    private getCheckersInTheMiddel(midCells: Cell<Checker>[]) {
        return midCells.reduce((prev: Cell<Checker>[], cur) => {
            if (cur.element) {
                prev.push(cur);
            }
            return prev;
        }, []);
    }

    private initMidCells(startCell: Cell<Checker>, endCell: Cell<Checker>, moveAnalizer: MoveAnalyzer, moveDescriptor: MoveDescriptor, board: Board<Checker>): Cell<Checker>[] {
        const midCells: Cell<Checker>[] = [];
        let cellIterator = startCell;
        while (cellIterator && (cellIterator !== endCell)) {
            const pos = moveAnalizer.getNextPositionByDirection(cellIterator.position, moveDescriptor.moveDirection, board);
            cellIterator = board.getCellByPosition(pos);
            if (cellIterator) {
                midCells.push(cellIterator);
            }
        }

        return midCells;
    }
}