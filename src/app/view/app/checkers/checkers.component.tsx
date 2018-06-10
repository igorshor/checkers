import * as React from "react";
import { inject } from "mobx-react";
import { BoardComponent } from "../common/board.component";
import { BoardStore } from "../stores/board.store";
import { AppStores } from "../..";

interface CheckersStores {
    boardStore?: BoardStore;
}

interface CheckersProps extends CheckersStores {
    boardStore?: BoardStore;
}

@inject((stores: AppStores) => {
    return { boardStore: stores.boardStore };
})
export class CheckersGameComponent extends React.Component<CheckersProps, {}> {
    render() {
        return (
            <BoardComponent boardStore={this.props.boardStore} />
        );
    }
}