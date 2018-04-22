import { PositionDefinition } from "../board/position";

export class MoveDescriptor {
    constructor(public from: PositionDefinition, public to: PositionDefinition, public playerId: any) { }
}