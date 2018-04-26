import { PositionDefinition } from "../board/position";
import { MoveType } from "./move-type";
import { MoveDirectionsDefinition, DirectionsDefinition } from "./move-direction";
import { CellContext } from "../board/cell-context";

export class SelectDescriptor extends CellContext {
    public type: MoveType;
    public direction: MoveDirectionsDefinition;
    posibleMoves: PositionDefinition[];

    get from(): PositionDefinition {
        return this.position;
    }

    constructor(from: PositionDefinition, playerId: number, elementId: number, direction: DirectionsDefinition) {
        super(from, playerId, elementId);
        this.posibleMoves = [];
    }
}