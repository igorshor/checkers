import { PositionDefinition } from "../board/position";
import { Cell } from "../board/cell";
import { IIdentible } from "./i-Identible";

export interface IMoveStrategy<T extends IIdentible> {
    play(): Promise<Cell<T>[]>;
    move(from: PositionDefinition, to: PositionDefinition): Cell<T>[];
    select(from: PositionDefinition): PositionDefinition[];
}