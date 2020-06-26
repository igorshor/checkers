import { MoveDescriptor } from "../../../common/descriptor/move-descriptor";
import { Board } from "../../../common/board/board";
import { Checker } from "../../board/checker";
import { IMoveAnalyzer } from "../../../common/interfaces/i-move-analyzer";
import { MoveHelper } from "../../../common/move/move-helper";
import { BoardController } from "../../board/board-controller";
import { Players } from "../../../common/player/players";
import { IBoardController } from "../../../common/interfaces/i-board-controller";
import { MoveType } from "../../../common/move/move-type";

export class AiMoveAnalyzer {
    constructor(private _moveAnalizer: IMoveAnalyzer<Checker>,
        private _players: Players<Checker>) {

    }
    
    // todo: filter DUPS !!!
    enrichWithAdditionalJumps(moveDescriptors: MoveDescriptor[], board: Board<Checker>): MoveDescriptor[] {
        if (!moveDescriptors.length) {
            return [];
        }
        const simulationBoard = board.immutableBoard;
        const simulationPlayers = this._players.mutatePlayers();
        const boardController = new BoardController(simulationBoard, this._moveAnalizer, simulationPlayers);
        const additionalPossibleMoves: MoveDescriptor[] = this.calculateAdditionalJumps(moveDescriptors, boardController);

        return additionalPossibleMoves;
    }

    private calculateAdditionalJumps(moveDescriptors: MoveDescriptor[], boardController: IBoardController<Checker>): MoveDescriptor[] {
        if (!moveDescriptors.length) {
            return [];
        }

        const additionalPossibleMoves: MoveDescriptor[] = [];

        moveDescriptors.forEach((moveDescriptor: MoveDescriptor) => {
            const isAtack = MoveHelper.isAtack(moveDescriptor.type);

            if (!isAtack) {
                return;
            }

            boardController.doMove(moveDescriptor)
            const fromCell = boardController.board.getCellByPosition(moveDescriptor.to);

            const additionalMoves = this._moveAnalizer.getPossibleMovesByCell(fromCell, boardController.board, [MoveType.Attack, MoveType.AttackDanger])
            additionalMoves
            .forEach((additionalJumpMoveDescriptor: MoveDescriptor, index: number) => { 
                const moveCopy = moveDescriptor.mutatePath();
                additionalPossibleMoves.push(moveCopy)
                
                moveCopy.addNext(additionalJumpMoveDescriptor.to); 
            });

            const nextAdditionalPossibleMoves = this.calculateAdditionalJumps(additionalMoves, boardController);

            boardController.undoMove(moveDescriptor)
            additionalPossibleMoves.push(...nextAdditionalPossibleMoves);
        });


        return additionalPossibleMoves;
    }
}

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