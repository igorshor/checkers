import { PositionDefinition } from "../board/position";
import { MoveType } from "./move-type";
import { MoveDirectionsDefinition, DirectionsDefinition } from "./move-direction";

export class MoveDescriptor {
    public type: MoveType;
    public chainedMoves: MoveDescriptor[];
    public direction:MoveDirectionsDefinition;

    constructor(public from: PositionDefinition, public to: PositionDefinition, public playerId: any) {
        const vertical = (from.y - to.y) > 0 ? DirectionsDefinition.Up : DirectionsDefinition.Down;
        const horizontal = (from.x - to.x) > 0 ? DirectionsDefinition.Left : DirectionsDefinition.Right;
        this.direction = vertical & horizontal
     }
}