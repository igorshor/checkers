import * as React from "react";
import { Position } from "../../models/position.model";
import '../styles/cell.style.scss';
import { inject, observer } from "mobx-react";
import { PlayersStore } from "../stores/players.store";
import { AppStores } from "../..";
import { PositionType } from "../../../model/common/board/position-type";
interface CellStores {
    playersStore?: PlayersStore;
}

export interface CellProps extends CellStores {
    position: Position;
    type: PositionType;
    playerId?: string;
}

@inject((stores: AppStores) => {
    return { playersStore: stores.playersStore };
})
@observer export class CellComponent extends React.Component<CellProps, {}> {
    private getPlayerUiIdentifier(): string {
        return this.props.playerId === this.props.playersStore.first.id ? 'one' : 'two';
    }

    private getCellUiIdentifier(): string {
        return this.props.type === PositionType.Black ? 'black' : 'white';
    }
    render(): React.ReactNode {
        let checker = null;
        if (this.props.playerId) {
            checker = <div className={'cell__checker cell__checker--' + this.getPlayerUiIdentifier()} />;
        }
        return (
            <div className={'cell cell--' + this.getCellUiIdentifier()}>
                {checker}
            </div>
        );
    }
}