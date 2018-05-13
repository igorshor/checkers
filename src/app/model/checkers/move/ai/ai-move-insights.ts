import { MoveDescriptor } from "../../../common/descriptor/move-descriptor";
import { IMovePicker } from "../../interfaces/i-move-picker";
import { moveRankMap, RankMap } from "./move-rank-map";

export class AiMoveInsights implements IMovePicker {
    private _rankMap: RankMap;

    constructor() {
        this._rankMap = moveRankMap;
    }

    calcBestMove(moves: MoveDescriptor[]): MoveDescriptor {
        return moves.reduce((prev, current) => this._rankMap[prev.type] > this._rankMap[current.type] ? prev : current);
    }

    public async evaluate(): Promise<MoveDescriptor> {
        return undefined;
    }
}