import { SelectDescriptor } from "./select-descriptor";
import { MoveDirectionsDefinition, DirectionsDefinition } from "../move/move-direction";
import { IPosition, IGhostPosition } from "../board/position";
import { MoveType } from "../move/move-type";
import { MoveHelper } from "../move/move-helper";

export class MoveDescriptor extends SelectDescriptor {
    public direction: DirectionsDefinition;
    public readonly moveDirection: MoveDirectionsDefinition;
    public attacked?: IGhostPosition;
    public level = 1;
    public next?: MoveDescriptor;
    public prev?: MoveDescriptor;

    constructor(from: IPosition, public to: IPosition, playerId: string, elementId: number, kingMove?: boolean) {
        super(from, playerId, elementId, kingMove);

        this.direction = MoveHelper.getVerticalDirection(from.y, to.y);
        const horizontal = MoveHelper.getHorizontalDirection(from.x, to.x);;
        this.moveDirection = this.direction | horizontal;
    }

    get isMultiMove(): boolean {
        return !!this.next || !!this.prev
    }

    get isFinal(): boolean {
        return this.finalMove === this;
    }

    get initialMove(): MoveDescriptor {
        let move: MoveDescriptor = this;

        while(move.prev) {
            move = move.prev;
        }

        return move;
    }

    get finalMove(): MoveDescriptor {
        let move: MoveDescriptor = this;

        while(move.next) {
            move = move.next;
        }

        return move;
    }

    get distance():number {
        return MoveHelper.getDistance(this.from, this.to);
    }

    get isAttack():boolean {
        return this.type === MoveType.Attack || this.type === MoveType.AttackDanger;
    }

    addNext(to: IPosition, makeKing?: boolean): MoveDescriptor {
        const nextMove = new MoveDescriptor(this.to, to, this.playerId, this.elementId, this.kingMove || makeKing)

        this.next = nextMove;
        nextMove.level = this.level + 1;
        nextMove.prev = this;

        return nextMove;
    }
}