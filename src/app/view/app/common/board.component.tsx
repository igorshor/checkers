import * as React from "react";
import { BoardStore } from "../stores/board.store";
import { CellComponent } from "./cell.component";
import { Cell } from "../../models/cell.model";
import './board.style.scss';
import { inject, observer } from "mobx-react";
import { AppStores } from "../..";
import { GameStore } from "../stores/game.store";
import { PlayersStore } from "../stores/players.store";
import { IPosition } from "../../../model/common/board/position";

interface BoardStores {
    boardStore?: BoardStore;
    gameStore?: GameStore;
    playersStore? : PlayersStore
}

interface BoardProps extends BoardStores { }

@inject((stores: AppStores) => {
    return {
        boardStore: stores.boardStore,
        playersStore: stores.playersStore,
        gameStore: stores.gameStore
    };
})
@observer export class BoardComponent extends React.Component<BoardProps, {}> {
    handelCellSelection = (position: IPosition) => {
        const cell = this.props.boardStore.getCell(position);
        const curentPlayer = this.props.playersStore.currentPlayer
        
        if (cell.playerId === curentPlayer.id) {
            this.props.gameStore.select(cell);
        }

    }

    getCellComponent = (cell: Cell): React.ReactNode => {
        return (
            <CellComponent
                key={cell.id}
                position={cell.position}
                type={cell.type}
                playerId={cell.playerId}
                prediction={cell.prediction}
                isKing={cell.isKink}
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