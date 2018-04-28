import { IMoveStrategy } from "../../../common/interfaces/i-move-strategy";
import { SelectDescriptor } from "../../../common/descriptor/select-descriptor";
import { Subscription } from "@reactivex/rxjs";
import { Checker } from "../../board/checker";
import { GameStateManager } from "../../../common/game/game-state";
import { Board } from "../../../common/board/board";
import { IMoveValidator } from "../../../common/interfaces/i-move-validator-interceptorr";
import { IMoveAnalyzer } from "../../../common/interfaces/i-move-analyzer";
import { PlayersManager } from "../../../common/player/players-manager";
import { MoveDescriptor } from "../../../common/descriptor/move-descriptor";
import { CellContext } from "../../../common/board/cell-context";
import { Cell } from "../../../common/board/cell";
import { MoveType } from "../../../common/move/move-type";
import { PositionDefinition } from "../../../common/board/position";
import { CellState } from "../../../common/board/cell-state";

export class PlayerMoveStrategy implements IMoveStrategy<Checker> {
    private _selection: SelectDescriptor;
    private _selectionSubscription: Subscription;
    protected _playDeferredPromise: JQuery.Deferred<Cell<Checker>[]>;
    constructor(protected _board: Board<Checker>,
        protected _state: GameStateManager<Checker>,
        protected _moveValidator: IMoveValidator<Checker>,
        protected _moveAnalizer: IMoveAnalyzer<Checker>,
        protected _playersManager: PlayersManager<Checker>) {
    }

    public async play(): Promise<Cell<Checker>[]> {
        this._playDeferredPromise = jQuery.Deferred<Cell<Checker>[]>();
        this._selectionSubscription = this._state.selection.subscribe(this.handleSelect);

        return this._playDeferredPromise.promise();
    }

    private resolveMove(): void {
        this._selectionSubscription.unsubscribe();
        this._playDeferredPromise.resolve();
    }

    private handleSelect(selection: SelectDescriptor): void {
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

    protected onSelect(selection: SelectDescriptor, updatePrediction = true): Cell<Checker>[] {
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
            if (updatePrediction) {
                this._state.updateCells([cell, ...cells]);
            }

            return cells;
        }

        return [];
    }

    private onReSelect(selection: SelectDescriptor) {
        this.onUnSelect(selection);
        this.onSelect(selection);
    }

    private onUnSelect(selection: SelectDescriptor) {
        const cells = this._selection.posibleMoves.map(pos => this._board.getCellByPosition(pos));
        this._selection = undefined;
        cells.forEach(cell => cell.state = CellState.Normal);
        this._state.updateCells(cells);
    }

    protected select(from: PositionDefinition): PositionDefinition[] {
        const cell = this._board.getCellByPosition(from);
        if (!cell.element || !cell.element.id) {
            throw new Error('no id');
        }
        const selectDescriptor = new SelectDescriptor(from, this._playersManager.current.id, this._playersManager.current.direction, cell.element.id);
        const moves = this._moveAnalizer.getPossibleMoves(selectDescriptor, this._board);

        return moves.map(move => new PositionDefinition(move.to.x, move.to.y));
    }

    public move(from: PositionDefinition, to: PositionDefinition): Cell<Checker>[] {
        const cell = this._board.getCellByPosition(from);
        if (!cell.element || !cell.element.id) {
            throw new Error('no id');
        }

        const moveDescriptor = new MoveDescriptor(from, to, this._playersManager.current.id, cell.element.id);
        const validMove = this._moveValidator.validate(moveDescriptor, this._board);

        if (!validMove) {
            throw new Error('invalide move');
        }

        const moveType = this._moveAnalizer.getMoveType(from, to);
        moveDescriptor.type = moveType;
        const changes = this.doLogicalMove(moveDescriptor);
        this.onUnSelect(this._selection);
        this.resolveMove();

        return changes;
    }

    private doLogicalMove(moveDescriptor: MoveDescriptor): Cell<Checker>[] {
        const cellsToUpdate: Cell<Checker>[] = [];
        const from = new CellContext(moveDescriptor.from, moveDescriptor.playerId, moveDescriptor.elementId);
        const to = new CellContext(moveDescriptor.to, moveDescriptor.playerId, moveDescriptor.elementId);

        switch (moveDescriptor.type) {
            case MoveType.Move:
                cellsToUpdate.push(this._board.remove(from));
                cellsToUpdate.push(this._board.add(to));
                break;
            case MoveType.Atack:
                const attackedPosition = this._moveAnalizer.getNextPositionByDirection(moveDescriptor.from, moveDescriptor.moveDirection, this._board);
                const cell = this._board.getCellByPosition(attackedPosition);
                const attackedCellContext = new CellContext(moveDescriptor.from, this._playersManager.opponent.id, cell.element.id);

                cellsToUpdate.push(this._board.remove(from));
                cellsToUpdate.push(this._board.remove(attackedCellContext, true));
                cellsToUpdate.push(this._board.add(to));
                break;
        }

        return cellsToUpdate;
    }
}