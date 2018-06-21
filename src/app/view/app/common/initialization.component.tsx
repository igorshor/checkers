import * as React from "react";
import { inject, observer } from "mobx-react";
import { GameStore } from "../stores/game.store";
import { AppStores } from "../..";
import '../styles/initialization.style.scss';
import { action } from "mobx";
import { Configurations } from "../../../model/models/game-configurations";
import { PlayerDefinition } from "../../../model/models/player-definition";
import { ComputerLevel } from "../../../model/models/computer-level";
import { PlayersStore } from "../stores/players.store";
import { Player } from "../../models/player.model";

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
            firstPlayer: 'aaaa',
            secondPlayer: 'ccccccc'
        };

        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleStartGame = this.handleStartGame.bind(this);
    }

    private handleCheckboxChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            multiplayer: event.target.checked
        });
    }

    private handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            [event.target.name]: event.target.value
        } as any);
    }

    private handleStartGame(event: React.MouseEvent<HTMLButtonElement>) {
        this.startGame();
    }

    @action
    private startGame() {
        const configurations = new Configurations();
        let secondPlayerName = 'computer';
        let computerLevel: ComputerLevel;

        if (!this.state.multiplayer) {
            computerLevel = ComputerLevel.Medium;
            secondPlayerName = this.state.secondPlayer;
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
        return (
            <div>
                <label>Multiplayer
                        <input
                        type="checkbox"
                        checked={this.state.multiplayer}
                        onChange={this.handleCheckboxChange}
                    /></label>
                <label>First Player
                        <input
                        name="firstPlayer"
                        type="text"
                        placeholder="name"
                        value={this.state.firstPlayer}
                        required={true}
                        onChange={this.handleInputChange}
                    /></label>
                <label>Second Player
                        <input
                        name="secondPlayer"
                        type="text"
                        placeholder="name"
                        value={this.state.secondPlayer}
                        required={true}
                        onChange={this.handleInputChange}
                    /></label>
                <label>Start<button type="button" onClick={this.handleStartGame} /></label>
            </div>
        );
    }
}