import { IBoardController } from "../../common/interfaces/i-board-controller";
import { Checker } from "./checker";
import { Cell } from "../../common/board/cell";
import { MoveDescriptor } from "../../common/descriptor/move-descriptor";
import { SelectionContext } from "../../common/board/selection-context";
import { MoveType } from "../../common/move/move-type";
import { IMoveAnalyzer } from "../../common/interfaces/i-move-analyzer";
import { Board } from "../../common/board/board";
import { Players } from "../../common/player/players";

export class BoardController implements IBoardController<Checker> {
    constructor(private _board: Board<Checker>,
        private _moveAnalizer: IMoveAnalyzer<Checker>,
        private _players: Players<Checker>) {

    }

    public get board(): Board<Checker> {
        return this._board;
    }

    public doMove(moveDescriptor: MoveDescriptor): Cell<Checker>[] {
        const cellsToUpdate: Cell<Checker>[] = [];
        const from = new SelectionContext(moveDescriptor.from, moveDescriptor.playerId, moveDescriptor.elementId);
        const to = new SelectionContext(moveDescriptor.to, moveDescriptor.playerId, moveDescriptor.elementId);

        switch (moveDescriptor.type) {
            case MoveType.Move:
                cellsToUpdate.push(this._board.remove(from));
                cellsToUpdate.push(this._board.add(to));
                break;
            case MoveType.Attack:
                const attackedPosition = this._moveAnalizer.getNextPositionByDirection(moveDescriptor.from, moveDescriptor.moveDirection, this._board, true);
                const cell = this._board.getCellByPosition(attackedPosition);
                moveDescriptor.attacked = {
                    ...attackedPosition,
                    id: cell.element.id
                };
                const attackedCellContext = new SelectionContext(attackedPosition, this._players.opponent.id, cell.element.id);

                cellsToUpdate.push(this._board.remove(from));
                cellsToUpdate.push(this._board.remove(attackedCellContext, true));
                cellsToUpdate.push(this._board.add(to));
                break;
        }

        return cellsToUpdate;
    }

    public undoMove(moveDescriptor: MoveDescriptor): Cell<Checker>[] {
        const cellsToUpdate: Cell<Checker>[] = [];
        const from = new SelectionContext(moveDescriptor.from, moveDescriptor.playerId, moveDescriptor.elementId);
        const to = new SelectionContext(moveDescriptor.to, moveDescriptor.playerId, moveDescriptor.elementId);

        switch (moveDescriptor.type) {
            case MoveType.Move:
                cellsToUpdate.push(this._board.add(from));
                cellsToUpdate.push(this._board.remove(to));
                break;
            case MoveType.Attack:
                const attacked = moveDescriptor.attacked;
                const attackedCellContext = new SelectionContext(attacked, this._players.opponent.id, attacked.id);

                cellsToUpdate.push(this._board.add(from));
                cellsToUpdate.push(this._board.add(attackedCellContext, true));
                cellsToUpdate.push(this._board.remove(to));
                break;
        }

        return cellsToUpdate;
    }
}