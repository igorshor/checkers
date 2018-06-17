import { IPosition } from "./position";

export class SelectionContext {
    public position: IPosition;
    public playerId: string;
    public elementId?: number;

    constructor(position: IPosition, playerId: string, elementId?: number) {
        this.position = position;
        this.playerId = playerId;
        this.elementId = elementId;
    }
}