import { PositionDefinition } from "../board/position";
import { Board } from "../board/board";
import { Player } from "../game/player";
import { GameStateManeger } from "../game/game-state";
import { IMoveStrategy } from "../interfaces/i-move-strategy";
import { MoveDescriptor } from "./move-descriptor";
import { IMoveValidator } from "../interfaces/i-move-validator-interceptorr";

export class MoveManeger implements IMoveStrategy {
    private _currentPlayer: Player;

    constructor(private _board: Board, private _state: GameStateManeger, private _moveValidator: IMoveValidator) {
        this._state.player.subscribe((player: Player) => this._currentPlayer = player);
    }

    public move(from: PositionDefinition, to: PositionDefinition): boolean {
        const moveDescriptor = new MoveDescriptor(from, to, this._currentPlayer.id);
        const validMove = this._moveValidator.validate(moveDescriptor, this._board)

        if (validMove) {
            return true;
        }

        return false;
    }
}