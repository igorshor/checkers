import { Checker } from "../../board/checker";
import { IMoveValidator } from "../../../common/interfaces/i-move-validator-interceptorr";
import { IMoveAnalyzer } from "../../../common/interfaces/i-move-analyzer";
import { PlayersManager } from "../../../common/player/players-manager";
import { IPosition } from "../../../common/board/position";
import { Cell } from "../../../common/board/cell";
import { PlayerMoveStrategy } from "../player/player-move-strategy";
import { AiMoveRunner } from "./ai-move-runner";
import { IBoardController } from "../../../common/interfaces/i-board-controller";
import { AiMoveInsights } from "./ai-move-insights";
import { GameStateManager } from "../../../common/game/game-state-manager";
import { ComputerLevel } from "../../../models/computer-level";
import { SelectDescriptor } from "../../../common/descriptor/select-descriptor";
import { MoveAnalyzer } from "../move-analyzer";

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
        const moveAnalizer = new MoveAnalyzer(simulationPlayers, this._moveValidator);
        const aiMoveIterable = new AiMoveRunner(moveAnalizer, simulationPlayers, simulationBoard, this._moveInsights, this._depth);
        const moveTree = await aiMoveIterable.calculate();
        const bestMove = await this._moveInsights.evaluate(moveTree, this._depth);

        this.onSelect(bestMove);
        const changedCells = this.move(bestMove.from, bestMove.to);

        return changedCells;
    }
}