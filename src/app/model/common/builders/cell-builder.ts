import { IPositionStrategy } from "../interfaces/i-position-strategy";
import { IIdentible } from "../interfaces/i-Identible";
import { IPosition } from "../board/position";
import { Player } from "../player/player";
import { Cell } from "../board/cell";

export abstract class CellBuilder<T extends IIdentible> {
    abstract createElement(id: any, associatedId: any, position: IPosition): T;
    private static elementsCounter = 0;
    public build(positionStrategy: IPositionStrategy<T>, players: Player<T>[], position: IPosition): Cell<T> {
        const type = positionStrategy.getCellTypeByPosition(position);
        const playerId = positionStrategy.getPlayerByPosition(type, players, position);
        const element = this.createElement(++CellBuilder.elementsCounter, playerId, position);
        const cell = new Cell<T>(position, type, element);

        return cell;
    }
}