import { Checker } from "../board/checker";
import { IMoveAnalyzer } from "../../common/interfaces/i-move-analyzer";
import { MoveType } from "../../common/move/move-type";
import { IPosition } from "../../common/board/position";
import { Board } from "../../common/board/board";
import { SelectDescriptor } from "../../common/descriptor/select-descriptor";
import { MoveDescriptor } from "../../common/descriptor/move-descriptor";
import { DirectionsDefinition, MoveDirectionsDefinition } from "../../common/move/move-direction";
import { IMoveValidator } from "../../common/interfaces/i-move-validator-interceptorr";
import { Player } from "../../common/player/player";
import { Players } from "../../common/player/players";
import { MoveHelper } from "./move-helper";

enum SimulationResult {
    TryNext,
    Ok,
    NotPossible
}

export class MoveAnalyzer implements IMoveAnalyzer<Checker> {
    constructor(private _playersManager: Players<Checker>,
        private _moveValidator: IMoveValidator<Checker>) {

    }

    getGeneralMoveType(from: IPosition, to: IPosition, board: Board<Checker>): MoveType {
        const distance = MoveHelper.getDistance(from, to);
        const fromCell = board.getCellByPosition(from);

        if (distance === 1) {
            return MoveType.Move;
        } else if (distance === 2) {
            const pos = MoveHelper.simulateNextCellByDirection(from, MoveHelper.getMoveDirection(from, to));
            const cell = board.getCellByPosition(pos);

            return cell && cell.element && fromCell.element.correlationId !== cell.element.correlationId ? MoveType.Attack : MoveType.Invalid;
        } else {
            throw new Error('invalid move');
        }
    }

    getSpecificMoveType(from: IPosition, to: IPosition, board: Board<Checker>): MoveType {
        const moveType = this.getGeneralMoveType(from, to, board);
        const inDanger = this.isInDanger(to, board);
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

    private isInDanger(pos: IPosition, board: Board<Checker>): boolean {
        const posiibleDanger = [MoveHelper.simulateNextCellByDirection(pos, this._playersManager.current.direction | DirectionsDefinition.Left),
        MoveHelper.simulateNextCellByDirection(pos, this._playersManager.current.direction | DirectionsDefinition.Right)];

        return posiibleDanger.some((pos: IPosition) => {
            const cell = board.getCellByPosition(pos);
            return cell && cell.element && cell.element.correlationId === this._playersManager.opponent.id;
        });
    }

    getPossibleMovesByPlayer(player: Player<Checker>, board: Board<Checker>): MoveDescriptor[] {
        const playerCells = board.select(cell => cell.element && cell.element.correlationId === player.id);
        const possibleMoves: MoveDescriptor[] = [];

        playerCells.forEach(cell => {
            const select = new SelectDescriptor(cell.position, player.id, cell.element.id);

            possibleMoves.push(...this.getPossibleMovesBySelect(select, board));
        });

        return possibleMoves;
    }

    getPossibleMovesBySelect(select: SelectDescriptor, board: Board<Checker>): MoveDescriptor[] {
        const fromChecker = board.getCellByPosition(select.from).element;

        return fromChecker.possibleNextMovePositions
            .map((pos: IPosition) => {
                const moveDescriptopr = new MoveDescriptor(select.from, pos, select.playerId, fromChecker.id);
                moveDescriptopr.type = this.getGeneralMoveType(moveDescriptopr.from, moveDescriptopr.to, board);

                return moveDescriptopr;
            })
            .filter(move => this._moveValidator.validate(move, board, this._playersManager.get(select.playerId), this));
    }

    private checkIfMoveOrAttack(to: IPosition, board: Board<Checker>): SimulationResult {
        const cell = board.getCellByPosition(to);

        if (!cell) {
            return SimulationResult.NotPossible;
        }

        if (cell.element) {
            if (cell.element.correlationId === this._playersManager.opponent.id) {
                return SimulationResult.TryNext;
            } else if (cell.element.correlationId === this._playersManager.current.id) {
                return SimulationResult.NotPossible;
            } else {
                throw new Error('id not found');
            }
        } else {
            return SimulationResult.Ok;
        }
    }



    isAKing(moveDescriptor: MoveDescriptor): boolean {
        return this._playersManager.opponent.base === moveDescriptor.to.y;
    }

    private getSuperPossibleMove(position: IPosition, moveDirection: MoveDirectionsDefinition, board: Board<Checker>) {
        const unCheckedPosibleNextMoves = [];
        let cell = board.getCellByPosition(position);
        let pos = this.getNextPositionByDirection(position, moveDirection, board);

        while (cell) {
            unCheckedPosibleNextMoves.push(pos);

            pos = this.getNextPositionByDirection(pos, moveDirection, board);
            cell = board.getCellByPosition(pos);
        }

        return unCheckedPosibleNextMoves;
    }

    getNextPositionByDirection(position: IPosition, moveDirection: MoveDirectionsDefinition, board: Board<Checker>, forceNext?: boolean): IPosition {
        let pos = MoveHelper.simulateNextCellByDirection(position, moveDirection);
        if (forceNext) {
            return pos;
        }

        const result = this.checkIfMoveOrAttack(pos, board);

        if (result === SimulationResult.TryNext) {
            pos = MoveHelper.simulateNextCellByDirection(pos, moveDirection);
        }

        return pos;
    }
}