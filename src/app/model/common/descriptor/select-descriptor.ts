import { PositionDefinition } from "../board/position";
import { CellContext } from "../board/cell-context";
import { DirectionsDefinition, MoveDirectionsDefinition } from "../move/move-direction";
import { MoveType } from "../move/move-type";

export class SelectDescriptor extends CellContext {
    public type: MoveType;
    public direction: DirectionsDefinition;
    posibleMoves: PositionDefinition[];

    get from(): PositionDefinition {
        return this.position;
    }

    constructor(from: PositionDefinition, playerId: number, elementId: number, direction: DirectionsDefinition) {
        super(from, playerId, elementId);
        this.posibleMoves = [];
    }
}