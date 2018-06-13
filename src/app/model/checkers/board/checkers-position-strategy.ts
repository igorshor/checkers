import { IPositionStrategy } from "../../common/interfaces/i-position-strategy";
import { Player } from "../../common/player/player";
import { PlayersManager } from "../../common/player/players-manager";
import { Checker } from "./checker";
import { IPosition } from "../../common/board/position";
import { PositionType } from "../../common/board/position-type";
import { IIdentible } from "../../common/interfaces/i-Identible";


interface IValidPlayerPosition {
    valid: boolean;
    player: boolean;
}

export class CheckersPositionStrategy implements IPositionStrategy<Checker> {
    private _validRows: { [key: number]: IValidPlayerPosition };

    constructor(public width: number, public height: number) {
        this.calcValidRowsToInitPosition();
    }

    private calcValidRowsToInitPosition() {
        this._validRows = {};
        const maxValidRow = 3;

        for (let i = 0; i < this.height; i++) {
            if (i < maxValidRow || i >= this.height - maxValidRow) {
                this._validRows[i] = { valid: true, player: true };
            }
            else {
                this._validRows[i] = { valid: false, player: undefined };
            }
        }
    }

    public getCellTypeByPosition(position: IPosition): PositionType {
        if (position.x % 2 === 0 && position.y % 2 === 0 ||
            position.x % 2 === 1 && position.y % 2 === 1) {
            return PositionType.Black;
        }

        return PositionType.White;
    }

    public includeInGame(positionType: PositionType): boolean {
        return positionType === PositionType.Black;
    }

    public getPlayerByPosition(positionType: PositionType, players: Player<Checker>[], position: IPosition): string {
        if (positionType === PositionType.White) {
            return undefined;
        }

        const pos = this._validRows[position.y];
        if (pos.valid && pos.player) {
            return players[position.y < 3 ? 0 : 1].id;
        }

        return undefined;
    }
}