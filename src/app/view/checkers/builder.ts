import { BoardEvent } from "../../view-model/models/board-event";
import { Board } from "./models/board";
import { Cell } from "./models/cell";

export class Builder {
    public static board(width: number, height: number): Board {
        const board = new Board(width, height);
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                const position = { x: j, y: i };
                const cell = Builder.cell(j, i);
                board.cells[cell.pos.y][cell.pos.x] = cell;
            }
        }

        return board;
    }

    public static cell(width: number, height: number): Cell {
        return new Cell({ x: width, y: height }, $('div'));
    }
}