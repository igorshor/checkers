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
import { MoveDescriptor } from "../../../common/descriptor/move-descriptor";
import { AiMoveRunner } from "./ai-move-runner";
import { IBoardController } from "../../../common/interfaces/i-board-controller";
import { BoardController } from "../../board/board-controller";
import { AiMoveInsights } from "./ai-move-insights";

export class AiMoveStrategy extends PlayerMoveStrategy {
    private _depth: number;
    private _moveInsights: AiMoveInsights;

    constructor(state: GameStateManager<Checker>,
        moveValidator: IMoveValidator<Checker>,
        moveAnalizer: IMoveAnalyzer<Checker>,
        playersManager: PlayersManager<Checker>,
        level: ComputerLevel,
        boardController: IBoardController<Checker>) {
        super(state, moveValidator, moveAnalizer, playersManager, boardController);
        this._moveInsights = new AiMoveInsights();
        this._depth = level;
    }

    async play(): Promise<Cell<Checker>[]> {
        const simulationBoard = this._board.immutableBoard;
        const simulationPlayers = this._playersManager.mutatePlayers();
        const boardController = new BoardController(simulationBoard, this._moveAnalizer, simulationPlayers);
        const aiMoveIterable = new AiMoveRunner(this._moveAnalizer, simulationPlayers, simulationBoard, boardController, this._moveInsights, this._depth);
        const moveTree = await aiMoveIterable.calculate();
        const bestMove = await this._moveInsights.evaluate(moveTree);

        await setTimeout(() => this.select(bestMove.from));
        let changedCells;
        await setTimeout(() => changedCells = this.move(bestMove.from, bestMove.to));

        return changedCells;
    }

    move(from: PositionDefinition, to: PositionDefinition): Cell<Checker>[] {
        return super.move(from, to);
    }

    select(from: PositionDefinition): PositionDefinition[] {
        return super.select(from);
    }
}