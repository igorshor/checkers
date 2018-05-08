import { IMoveStrategy } from "../../../common/interfaces/i-move-strategy";
import { SelectDescriptor } from "../../../common/descriptor/select-descriptor";
import { Subscription } from "@reactivex/rxjs";
import { Checker } from "../../board/checker";
import { GameStateManager } from "../../../common/game/game-state";
import { Board } from "../../../common/board/board";
import { IMoveValidator } from "../../../common/interfaces/i-move-validator-interceptorr";
import { IMoveAnalyzer } from "../../../common/interfaces/i-move-analyzer";
import { PlayersManager } from "../../../common/player/players-manager";
import { PositionDefinition } from "../../../common/board/position";
import { Cell } from "../../../common/board/cell";
import { ComputerLevel } from "../../../api/models/computer-level";
import { PlayerMoveStrategy } from "../player/player-move-strategy";
import { AiMoveDescriptor, AiMovesDescriptor } from "./ai-move-descriptor";
import { MoveDescriptor } from "../../../common/descriptor/move-descriptor";

export class AiMoveStrategy extends PlayerMoveStrategy {
    private _depth: number;
    constructor(_board: Board<Checker>,
        _state: GameStateManager<Checker>,
        _moveValidator: IMoveValidator<Checker>,
        _moveAnalizer: IMoveAnalyzer<Checker>,
        _playersManager: PlayersManager<Checker>,
        level: ComputerLevel) {
        super(_board, _state, _moveValidator, _moveAnalizer, _playersManager);
        this._depth = level;
    }

    play(): Promise<Cell<Checker>[]> {
        this._playDeferredPromise = jQuery.Deferred<Cell<Checker>[]>();
        const testBoard = this._board.immutableBoard;
        const aiMoves: AiMovesDescriptor = new AiMovesDescriptor();


        return this._playDeferredPromise.promise();
    }


    private aiPlay(board: Board<Checker>, aiMoves: AiMovesDescriptor, moveDepth: number, currentDepth?: number) {
        if (moveDepth < currentDepth) {
            return;
        }

        const playerCells = board.select(cell => cell.element && cell.element.id === this._playersManager.current.id);

        playerCells.forEach(cell => {
            const select = new SelectDescriptor(cell.position, this._playersManager.current.id, cell.element.id, this._playersManager.current.direction);
            const possibleMoves = this._moveAnalizer.getPossibleMoves(select, board);

            possibleMoves.forEach((move: MoveDescriptor) => aiMoves.add(move));
        });
    }

    move(from: PositionDefinition, to: PositionDefinition): Cell<Checker>[] {
        throw new Error("Method not implemented.");
    }
    select(from: PositionDefinition): PositionDefinition[] {
        throw new Error("Method not implemented.");
    }
}