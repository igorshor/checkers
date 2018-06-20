import { SelectDescriptor } from "./select-descriptor";
import { MoveDirectionsDefinition, DirectionsDefinition } from "../move/move-direction";
import { IPosition, IGhostPosition } from "../board/position";


export class MoveDescriptor extends SelectDescriptor {
    public direction: DirectionsDefinition;
    public readonly moveDirection: MoveDirectionsDefinition;
    public attacked?: IGhostPosition;
    public kingMove?: boolean;
    public to: IPosition;
    constructor(from: IPosition, to: IPosition, playerId: string, elementId: number) {
        super(from, playerId, elementId);
        this.to = to;
        this.direction = (from.y - to.y) > 0 ? DirectionsDefinition.Up : DirectionsDefinition.Down;
        const horizontal = (from.x - to.x) > 0 ? DirectionsDefinition.Left : DirectionsDefinition.Right;
        this.moveDirection = this.direction | horizontal;
    }
}