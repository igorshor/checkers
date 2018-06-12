import { IPosition } from "../../model/common/board/position";

export class SelectionEvent {
    constructor(public position: IPosition, public playerId: string, public elementId: string) {

    }
}