import { MoveDescriptor } from "../../../common/descriptor/move-descriptor";
import { IMovePicker } from "../../interfaces/i-move-picker";
import { moveRankMap, RankMap } from "./move-rank-map";
import { AiMoveDescriptor } from "./ai-move-descriptor";

export class AiMoveInsights implements IMovePicker {
    private _rankMap: RankMap;

    constructor() {
        this._rankMap = moveRankMap;
    }

    public calcBestMove(moves: MoveDescriptor[]): MoveDescriptor {
        return moves.reduce((prev, current) => this._rankMap[prev.type] > this._rankMap[current.type] ? prev : current);
    }

    public async evaluate(moveTree: AiMoveDescriptor): Promise<MoveDescriptor> {
        return undefined;
    }
}