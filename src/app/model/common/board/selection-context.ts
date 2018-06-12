import { IPosition } from "./position";

export class SelectionContext {
    constructor(public position: IPosition, public playerId: string, public elementId?: number) {

    }
}