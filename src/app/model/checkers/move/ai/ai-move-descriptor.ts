import { MoveDescriptor } from "../../../common/descriptor/move-descriptor";
import { Checker } from "../../board/checker";
import { Board } from "../../../common/board/board";

export class AiMoveDescriptor extends MoveDescriptor {
    public counterMove: MoveDescriptor;
    public boardImage: Board<Checker>;
    public afterCounterMoveBoardState: Board<Checker>;
    public next: MoveDescriptor[];
    public parent: MoveDescriptor;
    constructor(move: MoveDescriptor, parent: MoveDescriptor) {
        super(move.from, move.to, move.playerId, move.elementId);
        this.type = move.type
        this.parent = parent;
    }

    add(...move: AiMoveDescriptor[]) {
        this.next = this.next || [];
        this.next.push(...move);
    }
}