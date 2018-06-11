import * as React from "react";
import { BoardStore } from "../stores/board.store";
import { CellComponent } from "./cell.component";
import { Cell } from "../../models/cell.model";
import '../styles/board.style.scss';
import { inject, observer } from "mobx-react";
import { AppStores } from "../..";

interface BoardStores {
    boardStore?: BoardStore;
}

interface BoardProps extends BoardStores { }

@inject((stores: AppStores) => {
    return { boardStore: stores.boardStore };
})
@observer export class BoardComponent extends React.Component<BoardStores, {}> {
    render(): React.ReactNode {
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