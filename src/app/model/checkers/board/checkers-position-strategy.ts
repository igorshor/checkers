import { IPositionStrategy } from "../../common/interfaces/i-position-strategy";
import { Player } from "../../common/player/player";
import { PlayersManager } from "../../common/player/players-manager";
import { Checker } from "./checker";
import { PositionDefinition } from "../../common/board/position";
import { PositionType } from "../../common/board/position-type";


interface IValidPlayerPosition {
    valid: boolean;
    player: boolean;
}

export class CheckersPositionStrategy implements IPositionStrategy {
    private _validRows: { [key: number]: IValidPlayerPosition };
    private _players: Player<Checker>[];

    constructor(public width: number, public height: number) {
        this.calcValidRowsToInitPosition();
    }

    private calcValidRowsToInitPosition() {
        const delta = 1;
        this._validRows = {};
        const maxValidRow = Math.floor(this.height * 0.4);
        for (let i = 0 + delta; i <= this.height; i++) {
            if (i <= maxValidRow || i >= this.height - maxValidRow) {
                this._validRows[i] = { valid: true, player: true };
            }
            else {
                this._validRows[i] = { valid: false, player: undefined };
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
            return undefined;
        }

        const pos = this._validRows[position.y];
        if (pos.valid) {
            return pos.player;
        }

        return undefined;
    }
}