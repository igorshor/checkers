import * as React from 'react';
import { GameStore } from './stores/game.store';
import { PlayersStore } from './stores/players.store';
import { BoardStore } from './stores/board.store';
import { CheckersGameComponent } from './checkers/game.component';

export class AppComponent extends React.Component<{}, {}> {
    render() {
        return (
            <CheckersGameComponent />
        );
    }
}