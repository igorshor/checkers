import { PositionStrategy } from "./position-strategy";
import { Player } from "./player";
import { PositionType } from "./position-type";
import { PositionDefinition } from './position';

interface IValidPlayerPosition {
    valid: boolean;
    player: Player;
}

export class CheckersPositionStrategy extends PositionStrategy {
    private _validRows: { [key: number]: IValidPlayerPosition };

    constructor(_size: number, _players: Player[]) {
        super(_size, _players.map(player => player.id));
        this.calcValidRowsToInitPosition();

    }

    private calcValidRowsToInitPosition() {
        const delta = 1;
        this._validRows = {};
        const maxValidRow = Math.floor(this._size * 0.4);
        for (let i = 0 + delta; i <= this._size; i++) {
            if (i <= maxValidRow) {
                this._validRows[i] = { valid: true, player: this._ids[1] };
            }
            else if (i >= this._size - maxValidRow) {
                this._validRows[i] = { valid: true, player: this._ids[0] };
            }
            else {
                this._validRows[i] = { valid: false, player: null };
            }
        }
    }

    public includeInGame(positionType: PositionType): boolean {
        return positionType === PositionType.Black;
    }

    public getPlayerByPosition(positionType: PositionType, position: PositionDefinition) {
        if (positionType === PositionType.White) {
            return null;
        }

        const pos = this._validRows[position.y];
        if (pos.valid) {
            return pos.player;
        }

        return null;
    }
}