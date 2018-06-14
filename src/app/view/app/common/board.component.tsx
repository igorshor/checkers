import * as React from "react";
import { BoardStore } from "../stores/board.store";
import { CellComponent } from "./cell.component";
import { Cell } from "../../models/cell.model";
import '../styles/board.style.scss';
import { inject, observer } from "mobx-react";
import { AppStores } from "../..";
import { GameStore } from "../stores/game.store";
import { IPosition } from "../../../model/common/board/position";

interface BoardStores {
    boardStore?: BoardStore;
    gameStore?: GameStore;
}

interface BoardProps extends BoardStores { }

@inject((stores: AppStores) => {
    return {
        boardStore: stores.boardStore,
        gameStore: stores.gameStore
    };
})
@observer export class BoardComponent extends React.Component<BoardProps, {}> {
    constructor(props: BoardProps) {
        super(props);

        this.handelCellSelection = this.handelCellSelection.bind(this);
        this.getCellComponent = this.getCellComponent.bind(this);
    }

    private handelCellSelection(position: IPosition) {
        this.props.gameStore.select(this.props.boardStore.getCell(position));
    }

    private getCellComponent(cell: Cell): React.ReactNode {
        return (
            <CellComponent
                key={cell.id}
                position={cell.position}
                type={cell.type}
                playerId={cell.playerId}
                prediction={cell.prediction}
                superMode={cell.superMode}
                selected={cell.selected}
                onCellSelection={this.handelCellSelection}
            />
        );
    }
    render(): React.ReactNode {
        const cellsComponents = this.props.boardStore.board.cells
            .map((cells: Cell[]) => (
                <div className={'board__row'} key={cells[0].position.y}>
                    {cells.map(this.getCellComponent)}
                </div>
            ));

        return (
            <div className={'board'}>
                {cellsComponents}
            </div>
        );
    }
}