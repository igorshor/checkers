import { PositionDefinition } from "../board/position";

export interface IMoveStrategy {
    play(): Promise<void>;
    move(from: PositionDefinition, to: PositionDefinition): boolean;
    select(from: PositionDefinition): PositionDefinition[];
}