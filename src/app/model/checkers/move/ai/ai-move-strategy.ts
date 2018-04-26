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

export class AiMoveStrategy implements IMoveStrategy {
    constructor(private _board: Board<Checker>,
        private _state: GameStateManager<Checker>,
        private _moveValidator: IMoveValidator<Checker>,
        private _moveAnalizer: IMoveAnalyzer,
        private _playersManager: PlayersManager<Checker>) {
    }

    select(from: PositionDefinition): PositionDefinition[] {
        throw new Error("Method not implemented.");
    }

    move(from: PositionDefinition, to: PositionDefinition): boolean {
        throw new Error("Method not implemented.");
    }
}