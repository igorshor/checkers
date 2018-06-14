import * as React from "react";
import '../styles/cell.style.scss';
import { inject, observer } from "mobx-react";
import { PlayersStore } from "../stores/players.store";
import { AppStores } from "../..";
import { PositionType } from "../../../model/common/board/position-type";
import { IPosition } from "../../../model/common/board/position";
interface CellStores {
    playersStore?: PlayersStore;
}

export interface CellProps extends CellStores {
    onCellSelection: (position: IPosition) => void;
    position: IPosition;
    type: PositionType;
    playerId?: string;
    prediction: boolean;
    superMode: boolean;
    selected: boolean;
}

@inject((stores: AppStores) => {
    return { playersStore: stores.playersStore };
})
@observer export class CellComponent extends React.Component<CellProps, {}> {
    private getPlayerUiIdentifier(): string {
        let checkerUiClasses = 'cell__checker cell__checker--';
        checkerUiClasses += this.props.playerId === this.props.playersStore.first.id ? 'one' : 'two';

        if (this.props.selected) {
            checkerUiClasses += ' cell__checker--selected';
        }

        if (this.props.prediction) {
            checkerUiClasses += ' cell__checker--prediction';
        }

        if (this.props.superMode) {
            checkerUiClasses += ' cell__checker--super';
        }

        return checkerUiClasses;
    }

    private handleClick = () => {
        this.props.onCellSelection(this.props.position);
    }

    private getCellUiIdentifier(): string {
        return 'cell cell--' +
            (this.props.type === PositionType.Black ? 'black' : 'white' as string);
    }
    render(): React.ReactNode {
        let checker = null;
        if (this.props.playerId) {
            checker = <div className={this.getPlayerUiIdentifier()} />;
        }

        return (
            <div onClick={this.handleClick} className={this.getCellUiIdentifier()}>
                {checker}
            </div>
        );
    }
}