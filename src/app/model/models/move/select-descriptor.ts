import { PositionDefinition } from "../board/position";
import { MoveType } from "./move-type";
import { MoveDirectionsDefinition, DirectionsDefinition } from "./move-direction";

export class SelectDescriptor {
    public type: MoveType;
    public direction:MoveDirectionsDefinition;

    constructor(public from: PositionDefinition, public playerId: any, direction:DirectionsDefinition) {
     }
}