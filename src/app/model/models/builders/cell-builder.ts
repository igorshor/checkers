import { Position } from '../position';
import { Cell } from '../cell';
import { PositionStrategy } from '../position-strategy';
import { Checker } from '../checker';

export class CellBuilder {
    public static build(positionStrategy: PositionStrategy, position: Position): Cell {
        const type = positionStrategy.getCellTypeByPosition(position);
        const playerId = positionStrategy.getPlayerByPosition(type, position);
        const include = positionStrategy.includeInGame(type);
        const checker = include ? new Checker(playerId) : null;
        const cell = new Cell(position, type, checker);

        return cell;
    }
}