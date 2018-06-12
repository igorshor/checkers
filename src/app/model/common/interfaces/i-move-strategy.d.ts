import { Cell } from "../board/cell";
import { IIdentible } from "./i-Identible";

export interface IMoveStrategy<T extends IIdentible> {
    play(): Promise<Cell<T>[]>;
}