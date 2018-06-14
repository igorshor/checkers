import { MoveDescriptor } from "../../../common/descriptor/move-descriptor";
import { Checker } from "../../board/checker";
import { Cell } from "../../../common/board/cell";
import { Board } from "../../../common/board/board";

export class AiMoveDescriptor extends MoveDescriptor {
    public counterMove: MoveDescriptor;
    public boardState: Board<Checker>;
    public afterCounterMoveBoardState: Board<Checker>;
    public next: MoveDescriptor[];

    constructor(move: MoveDescriptor, parent: MoveDescriptor) {
        super(move.from, move.to, move.playerId, move.elementId);
    }

    add(...move: AiMoveDescriptor[]) {
        this.next = this.next || [];
        this.next.push(...move);
    }
}