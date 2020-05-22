import { MoveDescriptor } from "../../../common/descriptor/move-descriptor";
import { Board } from "../../../common/board/board";
import { Checker } from "../../board/checker";

export class AiMoveAnalyzer {
    enrichWithAdditionalJumps(moveDescriptors: MoveDescriptor[], board: Board<Checker>): MoveDescriptor[] {
        if (!moveDescriptors.length) {
            return [];
        }

        const additionalJumps: MoveDescriptor[] = [];
        const originalFromCell = board.getCellByPosition(moveDescriptors[0].from);
        // TODO do it AI way :O

        // moveDescriptors
        // .forEach((moveDescriptor: MoveDescriptor) => {
        //     const fromCell = board.getCellByPosition(moveDescriptor.to);
        //     const fromCellSimulation = fromCell.mutateObject();
        //     fromCellSimulation.element = originalFromCell.element.mutate();

        //     const nextAdditionalMoves = this.getPossibleMovesByCell(fromCellSimulation, board)
        //     const nextAdditionalJumps = nextAdditionalMoves
        //     .filter((additionalJumpMoveDescriptor: MoveDescriptor) => MoveHelper.isAtack(additionalJumpMoveDescriptor.type))

        //     nextAdditionalMoves
        //     .forEach((additionalJumpMoveDescriptor: MoveDescriptor) => moveDescriptor.addNext(additionalJumpMoveDescriptor.to));

        //     additionalJumps.push(...nextAdditionalJumps);
        // })

        // this.enrichWithAdditionalJumps(additionalJumps, board);

        return additionalJumps;
    }
}