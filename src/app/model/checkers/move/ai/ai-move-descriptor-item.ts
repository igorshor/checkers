import { MoveDescriptor } from "../../../common/descriptor/move-descriptor";

export class AiMoveDescriptorItem extends MoveDescriptor {
    public counterMove: MoveDescriptor;

    constructor(move: MoveDescriptor) {
        super(move.from, move.to, move.playerId, move.direction);
    }
}