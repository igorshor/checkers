import { IGhostPosition, IPosition } from "../board/position";
import { IterationDirection } from "../general/iteration-direction";
import { DirectionsDefinition, MoveDirectionsDefinition } from "../move/move-direction";
import { MoveHelper } from "../move/move-helper";
import { MoveType } from "../move/move-type";
import { SelectDescriptor } from "./select-descriptor";

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

    iterateMove(func: (move: MoveDescriptor) => void, iterationDirection: IterationDirection = IterationDirection.Normal): void {
        let move: MoveDescriptor = iterationDirection === IterationDirection.Normal ? this.initialMove : this.finalMove

        while(move) {
            func(move)
            move = move[iterationDirection === IterationDirection.Normal ? 'next' : 'prev'];
        }
    }

    get isPartialMove(): boolean {
        return null;
    }

    get distance():number {
        return MoveHelper.getDistance(this.from, this.to);
    }

    get isAttack():boolean {
        return this.type === MoveType.Attack || this.type === MoveType.AttackDanger;
    }

    get strongId(): string {
        return MoveHelper.getId(this.initialMove.from, this.finalMove.to);
    }

    
    get id(): string {
        return MoveHelper.getId(this.from, this.to);
    }

    get pathId(): string {
        const moveIds: string[] = [];

        this.iterateMove((move: MoveDescriptor) => moveIds.push(move.id));

        const path = moveIds.join('+')

        return path;
    }

    addNext(to: IPosition, makeKing?: boolean): MoveDescriptor {
        const nextMove = new MoveDescriptor(this.to, to, this.playerId, this.elementId, this.kingMove || makeKing)

        if (this.next) {
            if (this.next.to === nextMove.to) {
                throw new Error('trying to add same move twice')
            }

            
            throw new Error('next allrady exists, need to separate moves!')
        }

        this.next = nextMove;
        nextMove.level = this.level + 1;
        nextMove.prev = this;
        nextMove.type = this.type;

        return nextMove;
    }

    mutatePath(): MoveDescriptor {
        const copyMoveDescriptor = new MoveDescriptor(this.from, this.to, this.playerId, this.elementId, this.kingMove);

        copyMoveDescriptor.attacked = this.attacked;
        copyMoveDescriptor.prev = this.prev?.mutatePath();
        copyMoveDescriptor.level = this.level;
        copyMoveDescriptor.type = this.type;
        
        return copyMoveDescriptor;
    }
}