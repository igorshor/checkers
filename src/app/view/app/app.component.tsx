import * as React from 'react';
import { GameStore } from './stores/game.store';
import { PlayersStore } from './stores/players.store';
import { BoardStore } from './stores/board.store';

export interface AppProps {
    gameStore: GameStore;
    playersStore: PlayersStore;
    boardStore: BoardStore;
}

export class AppComponent extends React.Component<AppProps, {}> {
    render() {
        return <div>dsadsadsdasd</div>;
    }
}