import { GameStore } from './stores/game.store';
import { PlayersStore } from './stores/players.store';
import { BoardStore } from './stores/board.store';
import React from 'react';

export interface AppProps {
    gameStore: GameStore;
    playersStore: PlayersStore;
    boardStore: BoardStore;
}

export class AppComponent extends React.Component<AppProps, {}> {

}