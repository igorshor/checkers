import { Player } from "../game/player";
import { PositionType } from "./position-type";
import { PositionDefinition } from './position';
import { IPositionStrategy } from "../interfaces/i-position-strategy";

interface IValidPlayerPosition {
    valid: boolean;
    player: Player;
}

export class CheckersPositionStrategy implements IPositionStrategy {
    private _validRows: { [key: number]: IValidPlayerPosition };

    constructor(private _size: number, private _players: Player[]) {
        this.calcValidRowsToInitPosition();

    }

    private calcValidRowsToInitPosition() {
        const delta = 1;
        this._validRows = {};
        const maxValidRow = Math.floor(this._size * 0.4);
        for (let i = 0 + delta; i <= this._size; i++) {
            if (i <= maxValidRow) {
                this._validRows[i] = { valid: true, player: this._players[1].id };
            }
            else if (i >= this._size - maxValidRow) {
                this._validRows[i] = { valid: true, player: this._players[0].id };
            }
            else {
                this._validRows[i] = { valid: false, player: null };
            }
        }
    }

    public getCellTypeByPosition(position: PositionDefinition): PositionType {
        if (position.x % 2 === 0 && position.y % 2 === 0 ||
            position.x % 2 === 1 && position.y % 2 === 1) {
            return PositionType.Black;
        }

        return PositionType.White;
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