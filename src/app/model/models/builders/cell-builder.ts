import { PositionDefinition } from '../board/position';
import { Cell } from '../board/cell';
import { Checker } from '../board/checker';
import { IPositionStrategy } from '../interfaces/i-position-strategy';

export class CellBuilder {
    public static build(positionStrategy: IPositionStrategy, position: PositionDefinition): Cell {
        const type = positionStrategy.getCellTypeByPosition(position);
        const playerId = positionStrategy.getPlayerByPosition(type, position);
        const include = positionStrategy.includeInGame(type);
        const checker = include ? new Checker(playerId) : new Checker(null);
        const cell = new Cell(position, type, checker);

        return cell;
    }
}