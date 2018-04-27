import { MoveRank } from "./move-rank";

export const moveRankMap = {
    [MoveRank.Move]: 3,
    [MoveRank.MoveDanger]: -1,
    [MoveRank.Attack]: 4,
    [MoveRank.AttackDanger]: -2,
    [MoveRank.Block]: 2
};