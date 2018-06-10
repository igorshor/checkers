import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { ViewModel } from '../view-model/view-model';
import { Board } from '../model/common/board/board';
import { AppComponent, AppProps } from './app/app.component';
import { BoardStore } from './app/stores/board.store';
import { GameStore } from './app/stores/game.store';
import { PlayersStore } from './app/stores/players.store';

export class View {
	private _appProps: AppProps;
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
			<AppComponent
				gameStore={this._appProps.gameStore}
				playersStore={this._appProps.playersStore}
				boardStore={this._appProps.boardStore}
			/>,
			document.getElementById('game')
		);
	}
}