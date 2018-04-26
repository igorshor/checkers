import { PositionDefinition } from '../board/position';
import { Cell } from '../board/cell';
import { Checker } from '../board/checker';
import { IPositionStrategy } from '../interfaces/i-position-strategy';
import { IIdentible } from '../interfaces/i-Identible';

export abstract class CellBuilder<T extends IIdentible> {
    abstract createElement(id: any): T;
    public build(positionStrategy: IPositionStrategy, position: PositionDefinition): Cell<T> {
        const type = positionStrategy.getCellTypeByPosition(position);
        const playerId = positionStrategy.getPlayerByPosition(type, position);
        const include = positionStrategy.includeInGame(type);
        const element = this.createElement(playerId);
        const cell = new Cell<T>(position, type, element);

        return cell;
    }
}