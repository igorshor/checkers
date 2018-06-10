import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { ViewModel } from '../view-model/view-model';
import { Board } from '../model/common/board/board';
import { AppComponent } from './app/app.component';
import { BoardStore } from './app/stores/board.store';
import { GameStore } from './app/stores/game.store';
import { PlayersStore } from './app/stores/players.store';
import { Provider } from 'mobx-react';

export interface AppStores {
    gameStore: GameStore;
    playersStore: PlayersStore;
    boardStore: BoardStore;
}

export class View {
	private _appProps: AppStores;
	constructor(private _viewModel: ViewModel) {
		// tslint:disable-next-line:indent
		this.createStores();
		this.bootstrap();
	}

	// tslint:disable-next-line:indent
	private createStores() {
		this._appProps = {
			boardStore: new BoardStore(this._viewModel),
			gameStore: new GameStore(),
			playersStore: new PlayersStore(this._viewModel),
		};
	}

	private bootstrap() {
		ReactDOM.render(
			<Provider
				gameStore={this._appProps.gameStore}
				playersStore={this._appProps.playersStore}
				boardStore={this._appProps.boardStore}
			>
				<AppComponent />
			</Provider>,
			document.getElementById('game')
		);
	}
}