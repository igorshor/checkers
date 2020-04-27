import { MoveDescriptor } from "../../../common/descriptor/move-descriptor";
import { IMovePicker } from "../../interfaces/i-move-picker";
import { MOVE_RANK_MAP, RankMap } from "./move-rank-map";
import { AiMoveDescriptor } from "./ai-move-descriptor";

export class AiMoveInsights implements IMovePicker {
    public calcBestMove(moves: MoveDescriptor[]): MoveDescriptor {
        return moves.reduce((prev, current) => MOVE_RANK_MAP[prev.type] > MOVE_RANK_MAP[current.type] ? prev : current);
    }

    public async evaluate(root: AiMoveDescriptor, maxDepth: number): Promise<MoveDescriptor> {
        let  highestRankMove = await this.getHighestRank(root, maxDepth, root);

        while (highestRankMove.parent){
            if(highestRankMove.depth === 1){
                return highestRankMove;
            }

            highestRankMove = highestRankMove.parent;
        }

        return undefined;
    }

    private moveComperatorFunc = (a: AiMoveDescriptor, b: AiMoveDescriptor) => a > b ? a : b;

    private getHighestRank(node: AiMoveDescriptor, maxDepth: number, highestRank: AiMoveDescriptor): AiMoveDescriptor {
        node.rank = MOVE_RANK_MAP[node.type];
        const bestMove = this.moveComperatorFunc(node, highestRank) as AiMoveDescriptor;

        if (!node.next || !node.next.length) {
            return bestMove;
        }

        const children = node.next.map(node => this.getHighestRank(node, maxDepth, bestMove));
        return children.reduce((a, b) => this.moveComperatorFunc(a, b));
    }
}