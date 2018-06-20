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

enum SimulationResult {
    TryNext,
    Ok,
    NotPossible
}

export class MoveAnalyzer implements IMoveAnalyzer<Checker> {
    private static readonly singleEatRecDistance = 2;

    constructor(private _playersManager: Players<Checker>,
        private _moveValidator: IMoveValidator<Checker>) {

    }

    getGeneralMoveType(from: IPosition, to: IPosition): MoveType {
        const distance = this.getDistance(from, to);

        if (distance === 1) {
            return MoveType.Move;
        } else if (distance === 2) {
            return MoveType.Attack;
        } else {
            throw new Error('invalid move');
        }
    }

    getSpecificMoveType(from: IPosition, to: IPosition, board: Board<Checker>): MoveType {
        const moveType = this.getGeneralMoveType(from, to);
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
        const posiibleDanger = [this.simulateNextCellByDirection(pos, this._playersManager.current.direction | DirectionsDefinition.Left),
        this.simulateNextCellByDirection(pos, this._playersManager.current.direction | DirectionsDefinition.Right)];

        return posiibleDanger.some((pos: IPosition) => {
            const cell = board.getCellByPosition(pos);
            return cell && cell.element && cell.element.associatedId === this._playersManager.opponent.id;
        });
    }

    getPossibleMovesByPlayer(player: Player<Checker>, board: Board<Checker>): MoveDescriptor[] {
        const playerCells = board.select(cell => cell.element && cell.element.associatedId === player.id);
        const possibleMoves: MoveDescriptor[] = [];

        playerCells.forEach(cell => {
            const select = new SelectDescriptor(cell.position, player.id, cell.element.id);

            possibleMoves.push(...this.getPossibleMovesBySelect(select, board));
        });

        return possibleMoves;
    }

    getPossibleMovesBySelect(select: SelectDescriptor, board: Board<Checker>): MoveDescriptor[] {
        const fromChecker = board.getCellByPosition(select.from).element;
        const unCheckedPosibleNextPositions = this.getPossiblePositions(fromChecker, select, board);

        const moves = unCheckedPosibleNextPositions
            .map((pos: IPosition) => {
                const moveDescriptopr = new MoveDescriptor(select.from, { x: pos.x, y: pos.y }, select.playerId, fromChecker.id);

                moveDescriptopr.type = this.getGeneralMoveType(moveDescriptopr.from, moveDescriptopr.to);

                return moveDescriptopr;
            })
            .filter(move => this._moveValidator.validate(move, board, this._playersManager.get(select.playerId), this));

        return moves;
    }

    private getPossiblePositions(fromChecker: Checker, select: SelectDescriptor, board: Board<Checker>) {
        if (fromChecker.isKing) {
            return [
                ...this.getPlayerPossibleMoveDirections(this._playersManager.get(select.playerId)),
                ...this.getPlayerPossibleMoveDirections(this._playersManager.getOpponent(select.playerId))
            ]
                .map(moveDirection => this.getSuperPossibleMove(select.position, moveDirection, board))
                .reduce((arr, cur) => arr.push(...cur) && arr, []);
        }

        return this.getPlayerPossibleMoveDirections(this._playersManager.get(select.playerId))
            .map(moveDirection => this.getNextPositionByDirection(select.position, moveDirection, board));
    }

    private getPlayerPossibleMoveDirections(player: Player<Checker>) {
        const selectDirection = player.direction;
        return [selectDirection | DirectionsDefinition.Left, selectDirection | DirectionsDefinition.Right];
    }

    private checkIfMoveOrAttack(to: IPosition, moveDirection: MoveDirectionsDefinition, board: Board<Checker>): SimulationResult {
        const cell = board.getCellByPosition(to);

        if (!cell) {
            return SimulationResult.NotPossible;
        }

        if (cell.element) {
            if (cell.element.associatedId === this._playersManager.opponent.id) {
                return SimulationResult.TryNext;
            } else if (cell.element.associatedId === this._playersManager.current.id) {
                return SimulationResult.NotPossible;
            } else {
                throw new Error('id not found');
            }
        } else {
            return SimulationResult.Ok;
        }
    }

    private simulateNextCellByDirection(position: IPosition, moveDirection: MoveDirectionsDefinition): IPosition {
        const pos = { x: position.x, y: position.y };

        if (moveDirection & DirectionsDefinition.Up) {
            pos.y--;
        }

        if (moveDirection & DirectionsDefinition.Down) {
            pos.y++;
        }

        if (moveDirection & DirectionsDefinition.Right) {
            pos.x++;
        }

        if (moveDirection & DirectionsDefinition.Left) {
            pos.x--;
        }

        if (position.x === pos.x || position.y === pos.y) {
            throw new Error('position simulation problem');
        }

        return pos;
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
        let pos = this.simulateNextCellByDirection(position, moveDirection);
        if (forceNext) {
            return pos;
        }

        const result = this.checkIfMoveOrAttack(pos, moveDirection, board);

        if (result === SimulationResult.TryNext) {
            pos = this.simulateNextCellByDirection(pos, moveDirection);
        }

        return pos;
    }

    private getDistance(from: IPosition, to: IPosition): number {
        return Math.abs(from.y - to.y);
    }
}