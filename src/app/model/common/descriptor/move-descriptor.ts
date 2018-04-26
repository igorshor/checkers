import { SelectDescriptor } from "./select-descriptor";
import { MoveDirectionsDefinition, DirectionsDefinition } from "../move/move-direction";
import { PositionDefinition } from "../board/position";


export class MoveDescriptor extends SelectDescriptor {
    public moveDirection: MoveDirectionsDefinition;

    constructor(from: PositionDefinition, public to: PositionDefinition, playerId: number, elementId: number) {
        super(from, playerId, elementId, (from.y - to.y) > 0 ? DirectionsDefinition.Up : DirectionsDefinition.Down);

        const horizontal = (from.x - to.x) > 0 ? DirectionsDefinition.Left : DirectionsDefinition.Right;
        this.moveDirection = this.direction & horizontal;
    }
}