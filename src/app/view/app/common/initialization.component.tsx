import * as React from "react";
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Button } from 'office-ui-fabric-react/lib/Button';
import { inject, observer } from "mobx-react";
import { GameStore } from "../stores/game.store";
import { AppStores } from "../..";
import './initialization.style.scss';
import { action } from "mobx";
import { Configurations } from "../../../model/models/game-configurations";
import { PlayerDefinition } from "../../../model/models/player-definition";
import { ComputerLevel } from "../../../model/models/computer-level";
import { PlayersStore } from "../stores/players.store";
import { GameStage } from "../../../model/common/game/game-stage";

const DEFAULT_PLAYER_NAME = 'name'

interface InitializationStores {
    gameStore?: GameStore;
    playersStore?: PlayersStore;
}

interface InitializationProps extends InitializationStores { }

interface InitializationState {
    multiplayer: boolean;
    firstPlayer: string;
    secondPlayer: string;
}

@inject((stores: AppStores) => {
    return {
        gameStore: stores.gameStore,
        playersStore: stores.playersStore
    };
})
@observer export class InitializationComponent extends React.Component<InitializationProps, InitializationState> {
    constructor(props: InitializationProps) {
        super(props);
        this.state = {
            multiplayer: false,
            firstPlayer: DEFAULT_PLAYER_NAME,
            secondPlayer: DEFAULT_PLAYER_NAME
        };
    }

    private handleCheckboxChange = (event: any, checked: boolean) => {
        this.setState({
            multiplayer: checked
        });
    }

    private handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, newValue?: string) => {
        this.setState({
            [event.target.name]: newValue
        } as any);
    }

    private handleGameClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        const { gameStore } = this.props;

        switch(gameStore.state){
            case GameStage.Init:
            case GameStage.Finish:
                this.startGame();
                break;
            case GameStage.Game:
                this.startGame(); // add restart
        }
    }

    private getGameActionButtonText(): string {
        const { gameStore } = this.props;

        switch(gameStore.state){
            case GameStage.Init:
            case GameStage.Finish:
                return 'Start'
            case GameStage.Game:
                return 'Restart'
        }
    }

    @action
    private startGame() {
        const configurations = new Configurations();
        let secondPlayerName = 'computer';
        let computerLevel: ComputerLevel;

        if (!this.state.multiplayer) {
            computerLevel = ComputerLevel.Medium;
            secondPlayerName = 'computer';
        }

        const players = [
            new PlayerDefinition(this.state.firstPlayer, '1'),
            new PlayerDefinition(secondPlayerName, '2', computerLevel)
        ];

        players.forEach((player: PlayerDefinition) => this.props.playersStore.addPlayer(player));
        configurations.players = players;

        this.props.gameStore.start(configurations);
    }

    render() {
        const { multiplayer } = this.state;
        const { gameStore } = this.props;

        return (
            <div className='initialization'>
                <Toggle
                    className={'initialization__item'}
                    label={'Multiplayer'}
                    checked={multiplayer}
                    onChange={this.handleCheckboxChange}/>
                <TextField 
                    className={'initialization__item'}
                    name="firstPlayer"
                    label={multiplayer ? 'First Player' : 'Player'}
                    required
                    value={this.state.firstPlayer}
                    onChange={this.handleInputChange}/>
                { multiplayer && <TextField 
                    className={'initialization__item'}
                    name="secondPlayer"
                    required
                    value={this.state.secondPlayer}
                    label={'Second Player'}
                    onChange={this.handleInputChange}/>}
                <Button 
                    className={'initialization__item'}
                    onClick={this.handleGameClick} 
                    text={this.getGameActionButtonText()}/>
            </div>
        );
    }
}