import { RankMap, moveRankMap } from "./move-rank-map";
import { MoveType } from "../../../common/move/move-type";
import { AiMoveDescriptorItem } from "./ai-move-descriptor-item";

export class AiMoveDescriptor {
    private _rank: number;
    private _rankMap: RankMap;
    private _moves: AiMoveDescriptorItem[];

    constructor(move: AiMoveDescriptorItem) {
        this._moves = [];
        this.append(move);
        this._rankMap = moveRankMap;
        this._rank = 0;
        this._rankMap = moveRankMap;
    }

    public get initialMove(): AiMoveDescriptorItem {
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

    public append(move: AiMoveDescriptorItem): void {
        this._moves.push(move);
    }

    private addRank(moveType: MoveType) {
        this._rank += this._rankMap[moveType];
    }
}

export class AiMovesDescriptor {
    private _aiMoves: { [id: number]: AiMoveDescriptor } = {};

    public add(move: AiMoveDescriptorItem, shouldExist?: boolean) {
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