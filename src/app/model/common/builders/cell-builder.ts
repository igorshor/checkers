import { IPositionStrategy } from "../interfaces/i-position-strategy";
import { Cell } from "../board/cell";
import { IIdentible } from "../interfaces/i-Identible";
import { IPosition } from "../board/position";
import { Player } from "../player/player";

export abstract class CellBuilder<T extends IIdentible> {
    abstract createElement(id: any): T;
    public build(positionStrategy: IPositionStrategy<T>, players: Player<T>[], position: IPosition): Cell<T> {
        const type = positionStrategy.getCellTypeByPosition(position);
        const playerId = positionStrategy.getPlayerByPosition(type, players, position);
        const include = positionStrategy.includeInGame(type);
        const element = this.createElement(playerId);
        const cell = new Cell<T>(position, type, element);

        return cell;
    }
}