import { PositionDefinition } from "../board/position";
import { Board } from "../board/board";
import { Player } from "../game/player";
import { GameStateManager } from "../game/game-state";
import { IMoveStrategy } from "../interfaces/i-move-strategy";
import { MoveDescriptor } from "./move-descriptor";
import { IMoveValidator } from "../interfaces/i-move-validator-interceptorr";
import { IMoveAnalyzer } from "../interfaces/i-move-analyzer";

export class MoveManager implements IMoveStrategy {
    private _currentPlayer: Player;

    constructor(private _board: Board, private _state: GameStateManager, private _moveValidator: IMoveValidator, private _moveAnalizer: IMoveAnalyzer) {
        this._state.player.subscribe((player: Player) => this._currentPlayer = player);
    }

    public move(from: PositionDefinition, to: PositionDefinition): boolean {
        const moveDescriptor = new MoveDescriptor(from, to, this._currentPlayer.id);
        const validMove = this._moveValidator.validate(moveDescriptor, this._board)

        if (validMove) {
            const moveType = this._moveAnalizer.getMoveType(from, to);
            moveDescriptor.type = moveType;
            this._board.move(new MoveDescriptor(from, to, moveType))
            return true;
        }

        return false;
    }
}