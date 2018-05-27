import { CheckerEvent } from "../../view-model/models/checker-event";
import { Board } from "./models/board";

export class BoardUpdater {
    public static cell = (checkerEvent: CheckerEvent, board: Board): void => {

    };

    public static cells = (checkerEvent: CheckerEvent[], board: Board): void => {
        checkerEvent.forEach(cell => BoardUpdater.cell(cell, board));
    };
}