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
import { MoveHelper } from "../../common/move/move-helper";
import { IMoveTypeStrategy } from "../../common/interfaces/i-move-type-strategy";
import { KingMoveTypeStrategy } from "./move-type/king-move-type-strategy";
import { MoveTypeStrategy } from "./move-type/move-type-strategy";
import { Cell } from "../../common/board/cell";
import { AiMoveAnalyzer } from "./ai/ai-move-analyzer";

enum SimulationResult {
    TryNext,
    Ok,
    NotPossible
}

export class MoveAnalyzer implements IMoveAnalyzer<Checker> {
    private _kingMoveTypeStrategy: IMoveTypeStrategy<Checker>
    private _moveTypeStrategy: IMoveTypeStrategy<Checker>
    private _aiMoveAnalyzer: AiMoveAnalyzer;

    constructor(protected _playersManager: Players<Checker>,
        protected _moveValidator: IMoveValidator<Checker>) {

        this._kingMoveTypeStrategy = new KingMoveTypeStrategy();
        this._moveTypeStrategy = new MoveTypeStrategy();
        this._aiMoveAnalyzer = new AiMoveAnalyzer();
    }

    getMaxDistanceToBoundaries(pos: IPosition): number {
        const distanceToBoundaries = this._playersManager.players.map((player) => Math.abs(player.base - pos.y)) 
        const maxDistanceToBoundary = Math.max(...distanceToBoundaries)

        return maxDistanceToBoundary;
    }

    getMoveTypeStrategy(isKing: boolean): IMoveTypeStrategy<Checker> {
        return isKing ? this._kingMoveTypeStrategy : this._moveTypeStrategy;
    }

    getGeneralMoveType(moveDescriptor: MoveDescriptor, board: Board<Checker>): MoveType {
        return this.getMoveTypeStrategy(moveDescriptor.kingMove).getGeneralMoveType(moveDescriptor, board)
    }

    getSpecificMoveType(moveDescriptor: MoveDescriptor, board: Board<Checker>): MoveType {
        const moveType = this.getGeneralMoveType(moveDescriptor, board);
        const inDanger = this.isInDanger(moveDescriptor.to, board);
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

    protected isInDanger(pos: IPosition, board: Board<Checker>): boolean {
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

    getPossibleNextMovePositions(position: IPosition, attackDirections: DirectionsDefinition[], moves: number): IPosition[] {
        const ossibleNextMovePositions = Checker.possibleDirections
            .map((moveDirection) => attackDirections
                .map(attackDirection => this.nextPositions(position, attackDirection | moveDirection, moves))
                .reduce((acc, val) => acc.concat(val), []))
            .reduce((acc, val) => acc.concat(val), []);

        return ossibleNextMovePositions;
    }

    protected nextPositions(position: IPosition, moveDirection: MoveDirectionsDefinition, moves: number): IPosition[] {
        const positions: IPosition[] = [];
        let pos = position

        for (let i = 0; i < moves; i++) {
            pos = MoveHelper.simulateNextCellByDirection(pos, moveDirection)
            positions.push(pos);
        }

        return positions
    }

    getPossibleMovesByCell(fromCell: Cell<Checker>, board: Board<Checker>): MoveDescriptor[] {
        const fromChecker = fromCell.element;
        const playerId = fromCell.element.correlationId;

        const possibleNextMovePositions = this.getMoveTypeStrategy(fromChecker.isKing).getPossibleNextPositions(fromCell, this, this._playersManager)
        const possibleNextMoves = possibleNextMovePositions.map((pos: IPosition) => {
            const moveDescriptor = new MoveDescriptor(fromCell.position, pos, playerId, fromChecker.id, fromChecker.isKing);
            moveDescriptor.type = this.getGeneralMoveType(moveDescriptor, board);

            return moveDescriptor;
        })
        .filter(move => this._moveValidator.validate(move, board, this._playersManager.get(playerId), this));

        return possibleNextMoves;
    }

    getPossibleMovesBySelect(select: SelectDescriptor, board: Board<Checker>): MoveDescriptor[] {
        const fromCell = board.getCellByPosition(select.from);
        const possibleNextMoves = this.getPossibleMovesByCell(fromCell, board);
        const possibleNextAttackMoves = possibleNextMoves.filter((moveDescriptor: MoveDescriptor) => MoveHelper.isAtack(moveDescriptor.type));
        this._aiMoveAnalyzer.enrichWithAdditionalJumps(possibleNextAttackMoves, board);

        return possibleNextMoves;
    }

    // TODO check what this doing need add somthing for king ??
    protected checkIfMoveOrAttack(to: IPosition, board: Board<Checker>): SimulationResult {
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