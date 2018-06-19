import { IIdentible } from "../interfaces/i-Identible";

export interface IPosition {
    x: number;
    y: number;
}

export interface IGhostPosition extends IPosition, IIdentible {
    id: number;
}