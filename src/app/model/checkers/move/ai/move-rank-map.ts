import { MoveType } from "../../../common/move/move-type";
export interface RankMap { [key: number]: number; }
export const moveRankMap: RankMap = {
    [MoveType.Move]: 3,
    [MoveType.MoveDanger]: -1,
    [MoveType.Attack]: 4,
    [MoveType.AttackDanger]: -2,
    [MoveType.Block]: 2
};