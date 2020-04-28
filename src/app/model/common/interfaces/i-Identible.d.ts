import { IPosition } from "../board/position";

export interface IIdentible {
    id: any;
    playerId?: any,
    position?: IPosition;
    mutateObject?(): IIdentible;
}