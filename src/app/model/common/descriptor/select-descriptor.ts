import { IPosition } from "../board/position";
import { SelectionContext } from "../board/selection-context";
import { MoveType } from "../move/move-type";

export class SelectDescriptor extends SelectionContext {
    public type: MoveType;
    public posibleMoves: IPosition[];

    get from(): IPosition {
        return this.position;
    }

constructor(from: IPosition, playerId: string, elementId: number, public kingMove?: boolean) {
        super(from, playerId, elementId);
        this.posibleMoves = [];
    }
}