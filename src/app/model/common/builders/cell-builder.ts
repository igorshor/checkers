import { IPositionStrategy } from "../interfaces/i-position-strategy";
import { Cell } from "../board/cell";
import { IIdentible } from "../interfaces/i-Identible";
import { Position } from "../board/position";

export abstract class CellBuilder<T extends IIdentible> {
    abstract createElement(id: any): T;
    public build(positionStrategy: IPositionStrategy, position: Position): Cell<T> {
        const type = positionStrategy.getCellTypeByPosition(position);
        const playerId = positionStrategy.getPlayerByPosition(type, position);
        const include = positionStrategy.includeInGame(type);
        const element = this.createElement(playerId);
        const cell = new Cell<T>(position, type, element);

        return cell;
    }
}