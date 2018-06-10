import * as React from "react";
import { BoardStore } from "../stores/board.store";
import { CellComponent } from "./cell.component";
import { Cell } from "../../models/cell.model";
import '../styles/board.style.scss';


export class BoardComponent extends React.Component<{ boardStore: BoardStore }, {}> {
    render(): React.ReactNode {
        const cellsComponents = this.props.boardStore.board.cells
            .map((cells: Cell[], i: number) => (
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