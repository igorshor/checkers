import { IMoveStrategy } from "../../interfaces/i-move-strategy";
import { PositionDefinition } from "../../board/position";
import { MoveManager } from "../move-manager";
import { GameStateManager } from "../../game/game-state";
import { Board } from "../../board/board";
import { IMoveValidator } from "../../interfaces/i-move-validator-interceptorr";
import { IMoveAnalyzer } from "../../interfaces/i-move-analyzer";
import { IPlayersManager } from "../../interfaces/i-players-maneger";

export class AiMoveManager extends MoveManager {
    constructor(_board: Board, _state: GameStateManager, _moveValidator: IMoveValidator, _moveAnalizer: IMoveAnalyzer, _playersManager: IPlayersManager) {
        super(_board, _state, _moveValidator, _moveAnalizer, _playersManager);

    }

    move(from: PositionDefinition, to: PositionDefinition): boolean {
        throw new Error("Method not implemented.");
    }
}