import { PositionDefinition } from "./position";

export class CellContext {
    constructor(public position: PositionDefinition, public playerId: number, public elementId?: number) {

    }
}