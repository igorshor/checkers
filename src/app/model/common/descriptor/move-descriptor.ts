import { SelectDescriptor } from "./select-descriptor";
import { MoveDirectionsDefinition, DirectionsDefinition } from "../move/move-direction";
import { IPosition, IGhostPosition } from "../board/position";
import { MoveType } from "../move/move-type";
import { MoveHelper } from "../../checkers/move/move-helper";


export class MoveDescriptor extends SelectDescriptor {
    public direction: DirectionsDefinition;
    public readonly moveDirection: MoveDirectionsDefinition;
    public attacked?: IGhostPosition;

    constructor(from: IPosition, public to: IPosition, playerId: string, elementId: number, public kingMove?: boolean) {
        super(from, playerId, elementId);
        this.direction = (from.y - to.y) > 0 ? DirectionsDefinition.Up : DirectionsDefinition.Down;
        const horizontal = (from.x - to.x) > 0 ? DirectionsDefinition.Left : DirectionsDefinition.Right;
        this.moveDirection = this.direction | horizontal;
    }

    get distance():number{
        return MoveHelper.getDistance(this.from, this.to);
    }

    get isAttack():boolean{
        return this.type === MoveType.Attack || this.type === MoveType.AttackDanger;
    }
}