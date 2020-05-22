import { inject, observer } from "mobx-react";
import * as React from "react";
import { TooltipHost } from 'office-ui-fabric-react/lib/Tooltip';
import cls from 'classnames';
import { AppStores } from "../..";
import { IPosition } from "../../../model/common/board/position";
import { PositionType } from "../../../model/common/board/position-type";
import { PlayersStore } from "../stores/players.store";
import './cell.style.scss';
import { GameStore } from "../stores/game.store";
import { GameStage } from "../../../model/common/game/game-stage";

interface CellStores {
    playersStore?: PlayersStore;
    gameStore?: GameStore
}

export interface CellProps extends CellStores {
    onCellSelection: (position: IPosition) => void;
    position: IPosition;
    type: PositionType;
    playerId?: string;
    prediction: boolean;
    movable: boolean;
    isKing: boolean;
    selected: boolean;
}

@inject((stores: AppStores) => {
    return { 
        playersStore: stores.playersStore,
        gameStore: stores.gameStore
     };
})
@observer export class CellComponent extends React.Component<CellProps, {}> {
    private getPlayerBaseUiIdentifier(): string {
        const { playersStore, playerId } = this.props;
        let checkerUiClass = 'cell__checker cell__checker--';
        checkerUiClass += playerId === playersStore.first.id ? 'one' : 'two';

        return checkerUiClass;
    }

    private getPlayerUiIdentifier(): string {
        const { prediction, isKing, selected, playersStore, movable, playerId } = this.props;
        const checkerUiClasses = [this.getPlayerBaseUiIdentifier()];
        const currentPlayer = playersStore.currentPlayer;

        if (selected) {
            checkerUiClasses.push(' cell__checker--selected');
        }
        if (isKing) {
            checkerUiClasses.push(' cell__checker--super');
        }

        if (prediction) {
            checkerUiClasses.push(' cell__checker--prediction');
        }
        
        if (movable) {
            checkerUiClasses.push(' cell__checker--movable');
        }

        if (currentPlayer.isComputer || playerId !== currentPlayer.id || (!movable && !prediction)) {
            checkerUiClasses.push(' cell__checker--unTuckable');
        }

        return cls(...checkerUiClasses);
    }

    private handleClick = (event: React.MouseEvent) => {
        const { onCellSelection, position, playerId, gameStore } = this.props;

        if (gameStore.state !== GameStage.Game) {
            return;
        }

        onCellSelection && onCellSelection(position);
        
        if (playerId) {
            event.stopPropagation();
        }

    }

    private getCellUiIdentifier(): string {
        const { type } = this.props;

        return 'cell cell--' + (type === PositionType.Black ? 'black' : 'white');
    }

    render(): React.ReactNode {
        const { playerId, isKing, position } = this.props;
        let checkers: React.ReactNode[] = [];
        if (playerId) {
            if (isKing) {
                checkers.push(<div key='king' className={this.getPlayerUiIdentifier()} />)
            }
            
            checkers.push(<div key='regular' className={this.getPlayerUiIdentifier()} />);
        }

        // TODO REMOVE DEBUG OPTION !
        const posDebugStr = 'x:' + position.x + ' | y: ' + position.y;

        return (
            <TooltipHost content={posDebugStr}>
                <div onClick={this.handleClick} className={this.getCellUiIdentifier()}>
                    {checkers}
                    <div style={{display: 'none'}}>{posDebugStr}</div>
                </div>
                <div style={{display: 'none'}}>{posDebugStr}</div>
            </TooltipHost>
        );
    }
}