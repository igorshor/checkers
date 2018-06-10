import * as React from "react";
import { BoardStore } from "../stores/board.store";
import { Position } from "../../models/position.model";
import { CellType } from "../../models/cell-type.model";
import '../styles/cell.style.scss';
import { inject } from "mobx-react";
import { PlayersStore } from "../stores/players.store";
import { AppStores } from "../..";
interface CellStores {
    playersStore?: PlayersStore;
}

export interface CellProps extends CellStores {
    position: Position;
    type: CellType;
    playerId?: string;
}


@inject((stores: AppStores) => {
    return { playersStore: stores.playersStore };
})
export class CellComponent extends React.Component<CellProps, {}> {
    render(): React.ReactNode {
        let checker = null;
        if (this.props.playerId) {
            checker = <div className={'cell_checker--' + this.props.playersStore.players[0]} />;
        }
        return (
            <div className={'cell'}>
                {checker}
            </div>
        );
    }
}