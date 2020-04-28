import { IPosition } from "../board/position";

export interface IIdentible {
    id: any;
    correlationId?: any,
    position?: IPosition;
    mutate?(): IIdentible;
}