import { ViewModel } from '../view-model/view-model';
import { Board } from '../model/common/board/board';
import { AppComponent, AppProps } from './app/app.component';
import ReactDOM from 'react-dom';
import { BoardStore } from './app/stores/board.store';



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
			boardStore: new BoardStore(this._viewModel);
		}
	}

	private bootstrap() {
		ReactDOM.render(
			<AppComponent
				gameStore={this._appProps.gameStore}
				playersStore={this._appProps.playersStore}
				boardStore={this._appProps.boardStore}
			/>,
			document.getElementById('checkers');
		);
	}
}