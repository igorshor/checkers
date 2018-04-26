import { PositionDefinition } from "../board/position";
import { Board } from "../board/board";
import { Player } from "../game/player";
import { GameStateManager } from "../game/game-state";
import { IMoveStrategy } from "../interfaces/i-move-strategy";
import { MoveDescriptor } from "./move-descriptor";
import { IMoveValidator } from "../interfaces/i-move-validator-interceptorr";
import { IMoveAnalyzer } from "../interfaces/i-move-analyzer";
import { SelectDescriptor } from "./select-descriptor";
import { CellState } from "../board/cell-state";
import { IPlayersManager } from "../interfaces/i-players-maneger";
import { Checker } from "../board/checker";
import { MoveType } from "./move-type";
import { Cell } from "../board/cell";
import { CellContext } from "../board/cell-context";

export class MoveManager implements IMoveStrategy {
    private _selection: SelectDescriptor;

    constructor(private _board: Board<Checker>,
        private _state: GameStateManager,
        private _moveValidator: IMoveValidator<Checker>,
        private _moveAnalizer: IMoveAnalyzer,
        private _playersManager: IPlayersManager) {
        this._state.selection.subscribe(this.handleSelect);
    }

    protected handleSelect(selection: SelectDescriptor): void {
        if (!this._selection) {
            this.onSelect(selection);
        } else {
            const prevSelectionCell = this._board.getCellByPosition(this._selection.from);
            const currentSelectionCell = this._board.getCellByPosition(selection.from);


            if (prevSelectionCell.element.id === currentSelectionCell.element.id) {
                this.onReSelect(selection);
            } else {
                if (this._playersManager.exist(prevSelectionCell.element.id) || this._playersManager.exist(currentSelectionCell.element.id)) {
                    throw new Error('something went wrong');
                }

                this.move(prevSelectionCell.position, currentSelectionCell.position);
            }
        }
    }

    protected onSelect(selection: SelectDescriptor) {
        const cell = this._board.getCellByPosition(selection.from);

        if (!cell.element || cell.element.id !== this._playersManager.current.id) {
            throw new Error('something went wrong');
        }

        const posibleDestinations = this.select(selection.from);
        const posibleMovesDestinations = posibleDestinations
            .map(posibleDestination => new MoveDescriptor(selection.from, posibleDestination, this._playersManager.current.id, selection.elementId))
            .filter(move => this._moveValidator.validate(move, this._board))
            .map(move => move.to);

        this._selection = selection;

        if (posibleMovesDestinations.length) {
            this._selection.posibleMoves = posibleMovesDestinations;
            const cells = posibleMovesDestinations.map(pos => this._board.getCellByPosition(pos));
            cells.forEach(cell => cell.state = CellState.Prediction);
            this._state.updateCells([cell, ...cells]);
        }
    }

    protected onReSelect(selection: SelectDescriptor) {
        this.onUnSelect(selection);
        this.onSelect(selection);
    }

    private onUnSelect(selection: SelectDescriptor) {
        const cells = this._selection.posibleMoves.map(pos => this._board.getCellByPosition(pos));
        this._selection = undefined;
        cells.forEach(cell => cell.state = CellState.Normal);
        this._state.updateCells(cells);
    }

    public select(from: PositionDefinition): PositionDefinition[] {
        const cell = this._board.getCellByPosition(from);
        if (!cell.element || !cell.element.id) {
            throw new Error('no id');
        }
        const selectDescriptor = new SelectDescriptor(from, this._playersManager.current.id, this._playersManager.current.direction, cell.element.id);
        const moves = this._moveAnalizer.getPosibleMoves(selectDescriptor);

        return moves.map(move => new PositionDefinition(move.to.x, move.to.y, 0));
    }

    public move(from: PositionDefinition, to: PositionDefinition): boolean {
        const cell = this._board.getCellByPosition(from);
        if (!cell.element || !cell.element.id) {
            throw new Error('no id');
        }

        const moveDescriptor = new MoveDescriptor(from, to, this._playersManager.current.id, cell.element.id);
        const validMove = this._moveValidator.validate(moveDescriptor, this._board);

        if (validMove) {
            const moveType = this._moveAnalizer.getMoveType(from, to);
            moveDescriptor.type = moveType;
            this.doLogicalMove(moveDescriptor);
            this.onUnSelect(this._selection);

            return true;
        }

        return false;
    }

    private doLogicalMove(moveDescriptor: MoveDescriptor) {
        const cellsToUpdate: Cell<Checker>[] = [];
        const from = new CellContext(moveDescriptor.from, moveDescriptor.playerId, moveDescriptor.elementId);
        const to = new CellContext(moveDescriptor.to, moveDescriptor.playerId, moveDescriptor.elementId);

        switch (moveDescriptor.type) {
            case MoveType.Move:
                cellsToUpdate.push(this._board.remove(from));
                cellsToUpdate.push(this._board.add(to));
                break;
            case MoveType.Atack:
                const attackedPosition = this._moveAnalizer.getNextPositionByDirection(moveDescriptor);
                const cell = this._board.getCellByPosition(attackedPosition);
                const attackedCellContext = new CellContext(moveDescriptor.from, this._playersManager.opponent.id, cell.element.id);

                cellsToUpdate.push(this._board.remove(from));
                cellsToUpdate.push(this._board.remove(attackedCellContext, true));
                cellsToUpdate.push(this._board.add(to));
                break;
        }

        this._state.updateCells(cellsToUpdate);
    }
}