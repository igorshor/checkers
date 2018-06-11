import * as React from "react";
import { inject } from "mobx-react";
import { BoardComponent } from "../common/board.component";
import { BoardStore } from "../stores/board.store";
import { AppStores } from "../..";
import { InitializationComponent } from "../common/initialization.component";
import { GameStore } from "../stores/game.store";

interface CheckersStores {
    boardStore?: BoardStore;
    gameStore?: GameStore;
}

interface CheckersProps extends CheckersStores {
    boardStore?: BoardStore;
}

@inject((stores: AppStores) => {
    return {
        gameStore: stores.gameStore,
        boardStore: stores.boardStore
    };
})
export class CheckersGameComponent extends React.Component<CheckersProps, {}> {
    render() {
        let initialization = null;

        if (this.props.gameStore.initialized) {
            initialization = <InitializationComponent />;
        }

        return (
            <form>
                {initialization}
                <BoardComponent boardStore={this.props.boardStore} />
            </form>
        );
    }
}