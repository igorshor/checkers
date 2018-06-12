import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { ViewModel } from '../view-model/view-model';
import { AppComponent } from './app/app.component';
import { BoardStore } from './app/stores/board.store';
import { GameStore } from './app/stores/game.store';
import { PlayersStore } from './app/stores/players.store';
import { Provider } from 'mobx-react';
import { Observable } from '@reactivex/rxjs';

export interface AppStores {
	gameStore: GameStore;
	playersStore: PlayersStore;
	boardStore: BoardStore;
}

export class View {
	private _appProps: AppStores;
	
	private createStores(vm: ViewModel) {
		this._appProps = {
			boardStore: new BoardStore(vm),
			gameStore: new GameStore(vm),
			playersStore: new PlayersStore(vm),
		};
	}

	private initEvents() {
		// todo
	}

	public bootstrap(vm: ViewModel) {
		this.createStores(vm);
		this.initEvents();
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