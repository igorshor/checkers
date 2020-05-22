import { MoveDescriptor } from "../../../common/descriptor/move-descriptor";
import { Checker } from "../../board/checker";
import { Board } from "../../../common/board/board";

export class AiMoveDescriptor extends MoveDescriptor {
    public counterMove: MoveDescriptor;
    public boardImage: Board<Checker>;
    public afterCounterMoveBoardState: Board<Checker>;
    public nextMoves: AiMoveDescriptor[];
    public parent: AiMoveDescriptor;
    public depth: number;
    private _rank: number;

    constructor(move: MoveDescriptor, parent: AiMoveDescriptor) {
        super(move.from, move.to, move.playerId, move.elementId);
        this.type = move.type;
        this.parent = parent;
        this._rank = 0;
    }

    set rank(value: number) {
        this._rank = value;
    }

    get rank(): number {
        if (!this._rank) {
            return 0;
        }

        let calculatedRank = this._rank;
        let parent = this.parent;

        while (parent) {
            calculatedRank += parent.rank;
            parent = parent.parent;
        }

        return calculatedRank;
    }

    add(...move: AiMoveDescriptor[]) {
        this.nextMoves = this.nextMoves || [];
        this.nextMoves.push(...move);
    }

    valueOf() {
        return this.rank;
    }
}