import { MoveDescriptor } from "../../../common/descriptor/move-descriptor";
import { Checker } from "../../board/checker";
import { Cell } from "../../../common/board/cell";

export class AiMoveDescriptorItem extends MoveDescriptor {
    public counterMove: MoveDescriptor;
    public boardState: Cell<Checker>[][];
    constructor(move: MoveDescriptor, parent: MoveDescriptor) {
        super(move.from, move.to, move.playerId, move.direction);
    }
}