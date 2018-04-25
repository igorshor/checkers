import { PositionDefinition } from "../board/position";
import { MoveType } from "./move-type";
import { MoveDirectionsDefinition, DirectionsDefinition } from "./move-direction";

export class SelectDescriptor {
    public type: MoveType;
    public direction: MoveDirectionsDefinition;
    posibleMoves: PositionDefinition[];

    constructor(public from: PositionDefinition, public playerId: any, direction: DirectionsDefinition) {
        this.posibleMoves = [];
    }
}