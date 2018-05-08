import { MoveDescriptor } from "../../../common/descriptor/move-descriptor";
import { RankMap, moveRankMap } from "./move-rank-map";
import { MoveType } from "../../../common/move/move-type";

export class AiMoveDescriptor {
    private _rank: number;
    private _rankMap: RankMap;
    private _moves: MoveDescriptor[];

    constructor(move: MoveDescriptor) {
        this._moves = [];
        this.append(move);
        this._rankMap = moveRankMap;
        this._rank = 0;
    }

    public get initialMove(): MoveDescriptor {
        return this._moves[0];
    }

    public get id(): number {
        return this.initialMove.elementId;
    }

    public get movesCount() {
        return this._moves.length;
    }

    public get rank(): number {
        return this._rank;
    }

    public append(move: MoveDescriptor): void {
        this._moves.push(move);
    }

    private addRank(moveType: MoveType) {
        this._rank += this._rankMap[moveType];
    }
}

export class AiMovesDescriptor {
    private _aiMoves: { [id: number]: AiMoveDescriptor } = {};

    public add(move: MoveDescriptor, shouldExist?: boolean) {
        if (!this._aiMoves[move.elementId]) {
            if (shouldExist) {
                throw new Error('something went wrong');
            }

            this._aiMoves[move.elementId] = new AiMoveDescriptor(move);
        } else {
            this._aiMoves[move.elementId].append(move);
        }
    }
}