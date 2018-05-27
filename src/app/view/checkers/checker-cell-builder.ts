import { Cell } from "./models/cell";
import { CheckerEvent } from "../../view-model/models/checker-event";

export class CheckerCellBuilder {
    public static build(checkerEvent: CheckerEvent): Cell {
        return new Cell(checkerEvent.position, $('div'));
    }
}