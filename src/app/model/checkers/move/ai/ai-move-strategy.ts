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

export class AiMoveStrategy implements IMoveStrategy<Checker> {
    private _deep: number;
    constructor(private _board: Board<Checker>,
        private _state: GameStateManager<Checker>,
        private _moveValidator: IMoveValidator<Checker>,
        private _moveAnalizer: IMoveAnalyzer,
        private _playersManager: PlayersManager<Checker>,
        level: ComputerLevel) {
        this._deep = level;
    }

    play(): Promise<Cell<Checker>[]> {
        throw new Error("Method not implemented.");
    }
    move(from: PositionDefinition, to: PositionDefinition): Cell<Checker>[] {
        throw new Error("Method not implemented.");
    }
    select(from: PositionDefinition): PositionDefinition[] {
        throw new Error("Method not implemented.");
    }
}