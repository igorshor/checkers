import { SelectDescriptor } from "./select-descriptor";
import { MoveDirectionsDefinition, DirectionsDefinition } from "../move/move-direction";
import { PositionDefinition, IPosition } from "../board/position";


export class MoveDescriptor extends SelectDescriptor {
    public moveDirection: MoveDirectionsDefinition;
    public counterMove: MoveDescriptor;
    public attacked?: IPosition;
    constructor(from: PositionDefinition, public to: PositionDefinition, playerId: number, elementId: number) {
        super(from, playerId, elementId, (from.y - to.y) > 0 ? DirectionsDefinition.Up : DirectionsDefinition.Down);

        const horizontal = (from.x - to.x) > 0 ? DirectionsDefinition.Left : DirectionsDefinition.Right;
        this.moveDirection = this.direction & horizontal;
    }
}