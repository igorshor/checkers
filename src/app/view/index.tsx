import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { ViewModel } from '../view-model/view-model';
import { AppComponent } from './app/app.component';
import { BoardStore } from './app/stores/board.store';
import { GameStore } from './app/stores/game.store';
import { PlayersStore } from './app/stores/players.store';
import { Provider } from 'mobx-react';
import { Observable } from '@reactivex/rxjs';
import { SelectionEvent } from '../view-model/models/selection-event';
import { Configurations } from '../model/models/game-configurations';

export interface AppStores {
	gameStore: GameStore;
	playersStore: PlayersStore;
	boardStore: BoardStore;
}

export interface ViewHooks {
	selected: Observable<SelectionEvent>;
	configurationSetted: Observable<Configurations>;
}

export class View {
	private _appStores: AppStores;
	private _viewHooks: ViewHooks;

	private createStores(vm: ViewModel) {
		this._appStores = {
			boardStore: new BoardStore(vm),
			gameStore: new GameStore(vm),
			playersStore: new PlayersStore(vm),
		};
	}

	get viewHooks(): ViewHooks {
		return this._appStores.gameStore;
	}

	public bootstrap(vm: ViewModel) {
		this.createStores(vm);
		ReactDOM.render(
			<Provider {...this._appStores}>
				<AppComponent />
			</Provider>,
			document.getElementById('game')
		);
	}
}