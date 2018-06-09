import React, { ReactNode } from "react";
import { BoardStore } from "../stores/board.store";
import { CellComponent } from "./cell.component";
import { Cell } from "../../models/cell.model";

export class BoardComponent extends React.Component<{ boardStore: BoardStore }, {}> {
    render(): ReactNode {
        const cellsComponents = this.props.boardStore.board.cells
            .map((cells: Cell[]) => cells
                .map((cell: Cell) => <CellComponent key={cell.position.x + cell.position.y} position={cell.position} />));

        return (
            <div>
                {cellsComponents}
            </div>
        );
    }
}