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
import { AiMoveIterable } from "./ai-move-iterable";
import { IBoardController } from "../../../common/interfaces/i-board-controller";
import { BoardController } from "../../board/board-controller";

export class AiMoveStrategy extends PlayerMoveStrategy {
    private _depth: number;
    constructor(state: GameStateManager<Checker>,
        moveValidator: IMoveValidator<Checker>,
        moveAnalizer: IMoveAnalyzer<Checker>,
        playersManager: PlayersManager<Checker>,
        level: ComputerLevel,
        boardController: IBoardController<Checker>) {
        super(state, moveValidator, moveAnalizer, playersManager, boardController);
        this._depth = level;
    }

    play(): Promise<Cell<Checker>[]> {
        this._playDeferredPromise = jQuery.Deferred<Cell<Checker>[]>();
        const simulationBoard = this._board.immutableBoard;
        const simulationPlayers = this._playersManager.mutatePlayers();
        const aiMoves: AiMovesDescriptor = new AiMovesDescriptor();
        const boardController = new BoardController(simulationBoard, this._moveAnalizer, simulationPlayers);
        const aiMoveIterable = new AiMoveIterable(this._moveAnalizer, simulationPlayers, simulationBoard, boardController);
        const moveGenerator = aiMoveIterable.getGenerator();
        let shuldExist = false;
        let done = false;

        while (!done) {
            const moves = moveGenerator.next(this._depth > aiMoveIterable.depth);
            moves.value.forEach(move => aiMoves.add(move, shuldExist));
            done = moves.done;
            shuldExist = false;
        }

        return this._playDeferredPromise.promise();
    }

    move(from: PositionDefinition, to: PositionDefinition): Cell<Checker>[] {
        throw new Error("Method not implemented.");
    }
    select(from: PositionDefinition): PositionDefinition[] {
        throw new Error("Method not implemented.");
    }
}