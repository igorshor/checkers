import { Checker } from "../board/checker";
import { IMoveAnalyzer } from "../../common/interfaces/i-move-analyzer";
import { MoveType } from "../../common/move/move-type";
import { IPosition } from "../../common/board/position";
import { Board } from "../../common/board/board";
import { SelectDescriptor } from "../../common/descriptor/select-descriptor";
import { MoveDescriptor } from "../../common/descriptor/move-descriptor";
import { CheckerState } from "../board/checker-state";
import { DirectionsDefinition, MoveDirectionsDefinition } from "../../common/move/move-direction";
import { PlayersManager } from "../../common/player/players-manager";
import { IMoveValidator } from "../../common/interfaces/i-move-validator-interceptorr";
import { Player } from "../../common/player/player";

interface IFromTo<T> {
    from: T;
    to: T;
}

enum SimulationResult {
    TryNext,
    Ok,
    NotPossible
}

export class MoveAnalyzer implements IMoveAnalyzer<Checker> {
    private static readonly singleEatRecDistance = 2;

    constructor(private _playersManager: PlayersManager<Checker>,
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
        let possibleMoves: MoveDescriptor[];
        playerCells.forEach(cell => {
            const select = new SelectDescriptor(cell.position, player.id, cell.element.id);
            possibleMoves = this.getPossibleMovesBySelect(select, board);
        });

        return possibleMoves;
    }

    getPossibleMovesBySelect(select: SelectDescriptor, board: Board<Checker>): MoveDescriptor[] {
        const fromChecker = board.getCellByPosition(select.from).element;
        const unCheckedPosibleNextMoves = [];
        if (fromChecker.state === CheckerState.Super) {
            unCheckedPosibleNextMoves.push(...this.getSuperPossibleMoves(select, board));
        } else {
            unCheckedPosibleNextMoves.push(...this.getNormalPossibleMoves(select, board));
        }

        const moves = unCheckedPosibleNextMoves
            .map((pos: IPosition) => new MoveDescriptor(select.from, { x: pos.x, y: pos.y }, select.playerId, fromChecker.id))
            .filter(move => this._moveValidator.validate(move, board, this._playersManager.get(select.playerId)));

        return moves;
    }

    private getSuperPossibleMoves(select: SelectDescriptor, board: Board<Checker>) {
        const unCheckedPosibleNextMoves = [];

        const left = this.getSuperPossibleMove(select, board, DirectionsDefinition.Left);
        unCheckedPosibleNextMoves.push(...left);
        const right = this.getSuperPossibleMove(select, board, DirectionsDefinition.Right);
        unCheckedPosibleNextMoves.push(...right);

        return unCheckedPosibleNextMoves;
    }

    private getSuperPossibleMove(select: SelectDescriptor, board: Board<Checker>, direction: DirectionsDefinition) {
        const unCheckedPosibleNextMoves = [];
        let cell = board.getCellByPosition(select.position);
        const selectDirection = this._playersManager.get(select.playerId).direction;
        let pos = this.getNextPositionByDirection(select.position, selectDirection | direction, board);
        while (cell) {
            unCheckedPosibleNextMoves.push(pos);

            pos = this.getNextPositionByDirection(pos, selectDirection | direction, board);
            cell = board.getCellByPosition(pos);
        }

        return unCheckedPosibleNextMoves;
    }

    private getNormalPossibleMoves(select: SelectDescriptor, board: Board<Checker>) {
        const unCheckedPosibleNextMoves = [];
        const selectDirection = this._playersManager.get(select.playerId).direction;

        const left = this.getNextPositionByDirection(select.position, selectDirection | DirectionsDefinition.Left, board);
        unCheckedPosibleNextMoves.push(left);
        const right = this.getNextPositionByDirection(select.position, selectDirection | DirectionsDefinition.Right, board);
        unCheckedPosibleNextMoves.push(right);

        return unCheckedPosibleNextMoves;
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

        return pos;
    }

    getNextPositionByDirection(position: IPosition, moveDirection: MoveDirectionsDefinition, board: Board<Checker>): IPosition {
        let pos = this.simulateNextCellByDirection(position, moveDirection);
        const result = this.checkIfMoveOrAttack(pos, moveDirection, board);

        if (result === SimulationResult.TryNext) {
            pos = this.simulateNextCellByDirection(position, moveDirection);
        }

        return pos;
    }

    private getDistance(from: IPosition, to: IPosition): number {
        return Math.abs(from.y - to.y);
    }
}