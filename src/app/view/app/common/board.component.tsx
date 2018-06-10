import React, { ReactNode } from "react";
import { BoardStore } from "../stores/board.store";
import { CellComponent } from "./cell.component";
import { Cell } from "../../models/cell.model";

export class BoardComponent extends React.Component<{ boardStore: BoardStore }, {}> {
    render(): ReactNode {
        const cellsComponents = this.props.boardStore.board.cells
            .map((cells: Cell[]) => (
                <div className={'board__row'} key={cells[0].position.y}>
                    {cells.map((cell: Cell) => <CellComponent key={cell.id} position={cell.position} type={cell.type} />)}
                </div>
            ));

        return (
            <div className={'board'}>
                {cellsComponents}
            </div>
        );
    }
}