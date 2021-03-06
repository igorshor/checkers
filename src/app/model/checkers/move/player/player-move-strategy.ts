import { IMoveStrategy } from "../../../common/interfaces/i-move-strategy";
import { SelectDescriptor } from "../../../common/descriptor/select-descriptor";
import { Subscription } from "@reactivex/rxjs";
import { Checker } from "../../board/checker";
import { GameStateManager } from "../../../common/game/game-state-manager";
import { Board } from "../../../common/board/board";
import { IMoveValidator } from "../../../common/interfaces/i-move-validator-interceptorr";
import { IMoveAnalyzer } from "../../../common/interfaces/i-move-analyzer";
import { PlayersManager } from "../../../common/player/players-manager";
import { MoveDescriptor } from "../../../common/descriptor/move-descriptor";
import { Cell } from "../../../common/board/cell";
import { IPosition } from "../../../common/board/position";
import { CellState } from "../../../common/board/cell-state";
import { IBoardController } from "../../../common/interfaces/i-board-controller";
import { MoveHelper } from "../../../common/move/move-helper";
import { PositionHelper } from "../../../common/board/position-helper";

export class PlayerMoveStrategy implements IMoveStrategy<Checker> {
    protected _selection: SelectDescriptor;
    protected _posibleMoveDescriptorsMap: { [key: string]: MoveDescriptor };
    private _selectionSubscription: Subscription;
    protected _playDeferredPromise: JQuery.Deferred<Cell<Checker>[]>;
    protected _board: Board<Checker>;

    constructor(protected _state: GameStateManager<Checker>,
        protected _moveValidator: IMoveValidator<Checker>,
        private _moveAnalizer: IMoveAnalyzer<Checker>,
        protected _playersManager: PlayersManager<Checker>,
        private _boardController: IBoardController<Checker>) {
        this._board = this._boardController.board;
    }

    public async play(): Promise<Cell<Checker>[]> {
        this._playDeferredPromise = jQuery.Deferred<Cell<Checker>[]>();
        this._selectionSubscription = this._state.selection.subscribe((selection) => this.handleSelect(selection));

        return this._playDeferredPromise.promise();
    }

    private resolveMove(changes: Cell<Checker>[]): void {
        this._selectionSubscription.unsubscribe();
        this._playDeferredPromise.resolve(changes);
    }

    private handleSelect(selection: SelectDescriptor): void {
        if (!this._selection && selection) {
            this.onSelect(selection);

        } else if(!selection) {
            this.onUnSelect()
         }else {
            const prevSelectionCell = this._board.getCellByPosition(this._selection.from);
            const currentSelectionCell = this._board.getCellByPosition(selection.from);

            if (prevSelectionCell.element.correlationId === currentSelectionCell.element?.correlationId) {
                this.onReSelect(selection);
            } else {
                if (this._selection.posibleMoves.some(pos => PositionHelper.isSamePosition(pos, selection.position))) {
                    const moveChanges = this.move(prevSelectionCell.position, currentSelectionCell.position);
                    this.resolveMove(moveChanges);
                }
            }
        }
    }

    protected setPosibleDestinationMoveDescriptors(moveDescriptors: MoveDescriptor[]): void {
        this._posibleMoveDescriptorsMap = {};
        moveDescriptors.forEach((moveDescriptor: MoveDescriptor) => this._posibleMoveDescriptorsMap[moveDescriptor.strongId] = moveDescriptor);
    }

    private setAndUpdatePosibleMoves(posibleMovesDestinations: IPosition[]): Cell<Checker>[] {
        this._selection.posibleMoves = posibleMovesDestinations;

        const cells = posibleMovesDestinations.map(pos => this._board.getCellByPosition(pos));

        cells.forEach(cell => cell.state = CellState.Prediction);

        return cells;
    }

    protected onSelect(selection: SelectDescriptor, updatePrediction = true): Cell<Checker>[] {
        const cell = this._board.getCellByPosition(selection.from);
        const posibleDestinationMoveDescriptors = this.select(cell);
        const posibleMovesDestinations = posibleDestinationMoveDescriptors.map(move => move.to);

        this._selection = selection;

        if (posibleMovesDestinations.length) {
            this.setPosibleDestinationMoveDescriptors(posibleDestinationMoveDescriptors);
            const cells = this.setAndUpdatePosibleMoves(posibleMovesDestinations);

            this._state.updateCells([cell, ...cells]);

            return cells;
        }

        return [];
    }

    private onReSelect(selection: SelectDescriptor) {
        this.onUnSelect();
        this.onSelect(selection);
    }

    private onUnSelect() {
        if (!this._selection) {
            return;
        }

        const previousSelectionCell = this._board.getCellByPosition(this._selection.from);
        const cells = this._selection.posibleMoves.map(pos => this._board.getCellByPosition(pos));

        if (previousSelectionCell.element) {
            previousSelectionCell.element.selected = false;
        }

        this._selection = undefined;

        cells.forEach(cell => {
            cell.state = CellState.Normal;
            cell.element = undefined;
        });

        this._state.updateCells([previousSelectionCell, ...cells]);
    }

    protected select(cell: Cell<Checker>): MoveDescriptor[] {
        if (!cell.element || !cell.element.id || !cell.element.correlationId) {
            throw new Error('no id');
        }

        cell.element.selected = true;

        const moveDescriptors = this._moveAnalizer.getPossibleMovesByCell(cell, this._board);

        return moveDescriptors;
    }

    private getMoveDescriptor(from: IPosition, to: IPosition) {
        const cell = this._board.getCellByPosition(from);
        if (!cell.element || !cell.element.id || !cell.element.correlationId) {
            throw new Error('no id');
        }

        const moveId = MoveHelper.getId(from, to);
        const moveDescriptor = this._posibleMoveDescriptorsMap[moveId]

        if (!moveDescriptor) {
            throw new Error('mo possible move found'); 
        }

        return moveDescriptor;
    }

    public move(from: IPosition, to: IPosition): Cell<Checker>[] {
        const moveDescriptor = this.getMoveDescriptor(from, to);
        // const validMove = this._moveValidator.validate(moveDescriptor, this._board, this._playersManager.current, this._moveAnalizer); // need to remove this allredy ivaluated

        // if (!validMove) {
        //     throw new Error('invalide move');
        // }

        this.onUnSelect();
        const movesChanges: Cell<Checker>[][] = this._boardController.doMove(moveDescriptor);

        return movesChanges.reduce((acc, val) => acc.concat(val), []);
    }
}