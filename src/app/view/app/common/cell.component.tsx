import { inject, observer } from "mobx-react";
import * as React from "react";
import cls from 'classnames';
import { AppStores } from "../..";
import { IPosition } from "../../../model/common/board/position";
import { PositionType } from "../../../model/common/board/position-type";
import { PlayersStore } from "../stores/players.store";
import './cell.style.scss';
interface CellStores {
    playersStore?: PlayersStore;
}

export interface CellProps extends CellStores {
    onCellSelection: (position: IPosition) => void;
    position: IPosition;
    type: PositionType;
    playerId?: string;
    prediction: boolean;
    isKing: boolean;
    selected: boolean;
}

@inject((stores: AppStores) => {
    return { playersStore: stores.playersStore };
})
@observer export class CellComponent extends React.Component<CellProps, {}> {
    private getPlayerBaseUiIdentifier(): string {
        let checkerUiClass = 'cell__checker cell__checker--';
        checkerUiClass += this.props.playerId === this.props.playersStore.first.id ? 'one' : 'two';

        return checkerUiClass;
    }

    private getPlayerUiIdentifier(): string {
        const checkerUiClasses = [this.getPlayerBaseUiIdentifier()];

        if (this.props.selected) {
            checkerUiClasses.push(' cell__checker--selected');
        }
        if (this.props.isKing) {
            checkerUiClasses.push(' cell__checker--super');
        }

        if (this.props.prediction) {
            checkerUiClasses.push(' cell__checker--prediction');
        }

        if (this.props.playerId !== this.props.playersStore.currentPlayer.id) {
            checkerUiClasses.push(' cell__checker--unTuckable');
        }

        return cls(...checkerUiClasses);
    }

    private handleClick = (event: React.MouseEvent) => {
        const { onCellSelection, position, playerId } = this.props;

        onCellSelection && onCellSelection(position);
        
        if (playerId) {
            event.stopPropagation();
        }

    }

    private getCellUiIdentifier(): string {
        return 'cell cell--' +
            (this.props.type === PositionType.Black ? 'black' : 'white' as string);
    }

    render(): React.ReactNode {
        const { playerId, isKing } = this.props;
        let checker: React.ReactNode[] = [];
        if (playerId) {
            if (isKing) {
                checker.push(<div key='king' className={this.getPlayerUiIdentifier()} />)
            }
            
            checker.push(<div key='regular' className={this.getPlayerUiIdentifier()} />);
        }

        return (
            <div onClick={this.handleClick} className={this.getCellUiIdentifier()}>
                {checker}
            </div>
        );
    }
}