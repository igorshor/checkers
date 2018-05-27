import { BoardEvent } from "../../view-model/models/board-event";
import { Board } from "./models/board";
import { CheckerCellBuilder } from "./checker-cell-builder";

export class BoardBuilder {
    public static build(boardEvent: BoardEvent): Board {
        const board = new Board(boardEvent.width, boardEvent.height);
        for (let i = 0; i < boardEvent.height; i++) {
            for (let j = 0; j < boardEvent.width; j++) {
                const position = { x: j, y: i };
                const cell = CheckerCellBuilder.build(boardEvent.cells[i][j]);
                board.cells[cell.pos.y][cell.pos.x] = cell;
            }
        }

        return board;
    }
}