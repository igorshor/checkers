import { IPosition } from "../board/position";
import { SelectionContext } from "../board/selection-context";
import { DirectionsDefinition, MoveDirectionsDefinition } from "../move/move-direction";
import { MoveType } from "../move/move-type";

export class SelectDescriptor extends SelectionContext {
    protected _type: MoveType;
    public posibleMoves: IPosition[];

    get from(): IPosition {
        return this.position;
    }

    public get type(): MoveType {
        return this._type;
    }

    public set type(value: MoveType) {
        this._type = value;
    }

    constructor(from: IPosition, playerId: string, elementId: number) {
        super(from, playerId, elementId);
        this.posibleMoves = [];
    }
}