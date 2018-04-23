import { PositionDefinition } from "../board/position";
import { MoveType } from "./move-type";
import { MoveDirectionsDefinition, DirectionsDefinition } from "./move-direction";
import { SelectDescriptor } from "./select-descriptor";

export class MoveDescriptor extends SelectDescriptor{
    public moveDirection:MoveDirectionsDefinition;

    constructor(from: PositionDefinition, public to: PositionDefinition, playerId: any) {
        super(from, playerId, (from.y - to.y) > 0 ? DirectionsDefinition.Up : DirectionsDefinition.Down)

        const horizontal = (from.x - to.x) > 0 ? DirectionsDefinition.Left : DirectionsDefinition.Right;
        this.moveDirection = this.direction & horizontal
     }
}