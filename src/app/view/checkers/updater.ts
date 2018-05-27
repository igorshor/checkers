import { CheckerEvent } from "../../view-model/models/checker-event";
import { Board } from "./models/board";
import { BoardEvent } from "../../view-model/models/board-event";
import { GameEvent } from "../../view-model/models/game-event";
import { ChangeEvent } from "../../view-model/models/change-event";
import { PlayerEvent } from "../../view-model/models/player-event";

export class Updater {
    public static cell = (checkerEvent: CheckerEvent, board: Board): void => {
        // todo
    };

    public static player = (playerEvent: PlayerEvent, board: Board): void => {
        // todo
    };

    public static cells = (checkerEvent: CheckerEvent[], board: Board): void => {
        checkerEvent.forEach(cell => Updater.cell(cell, board));
    };

    public static change = (changeEvent: ChangeEvent, board: Board): void => {
        Updater.cells(changeEvent.items, board);
    };

    public static board = (boardEvent: BoardEvent, board: Board): void => {
        boardEvent.cells.forEach(cells => Updater.cells(cells, board));
    };

    public static game = (gameEvent: GameEvent, board: Board): void => {

    };
}