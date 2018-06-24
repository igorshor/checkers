import { IMoveInsights } from "./i-move-insights";
import { IPosition } from "../../common/board/position";
import { MoveHelper } from "../move/move-helper";
import { Board } from "../../common/board/board";
import { MoveType } from "../../common/move/move-type";
import { Checker } from "../board/checker";
import { DirectionsDefinition } from "../../common/move/move-direction";
import { Players } from "../../common/player/players";

export class NormalMoveInsights implements IMoveInsights {
    getGeneralMoveType(from: IPosition, to: IPosition, board: Board<Checker>): MoveType {
        const distance = MoveHelper.getDistance(from, to);
        const fromCell = board.getCellByPosition(from);

        if (distance === 1) {
            return MoveType.Move;
        } else if (distance === 2) {
            const pos = MoveHelper.simulateNextCellByDirection(from, MoveHelper.getMoveDirection(from, to));
            const cell = board.getCellByPosition(pos);

            return cell && cell.element && fromCell.element.associatedId !== cell.element.associatedId ?
                MoveType.Attack : MoveType.Invalid;
        } else {
            throw new Error('invalid move');
        }
    }

    getSpecificMoveType(from: IPosition, to: IPosition, board: Board<Checker>, playersManager: Players<Checker>): MoveType {
        const moveType = this.getGeneralMoveType(from, to, board);
        const inDanger = this.isInDanger(to, board, playersManager);
        if (inDanger) {
            switch (moveType) {
                case MoveType.Attack:
                    return MoveType.AttackDanger;
                case MoveType.Move:
                    return MoveType.MoveDanger;
            }
        }

        return moveType;
    }

    private isInDanger(pos: IPosition, board: Board<Checker>, playersManager: Players<Checker>): boolean {
        const posiibleDanger = [MoveHelper.simulateNextCellByDirection(pos, playersManager.current.direction | DirectionsDefinition.Left),
        MoveHelper.simulateNextCellByDirection(pos, playersManager.current.direction | DirectionsDefinition.Right)];

        return posiibleDanger.some((pos: IPosition) => {
            const cell = board.getCellByPosition(pos);
            return cell && cell.element && cell.element.associatedId === playersManager.opponent.id;
        });
    }
}