import { Model } from './model';
import { View } from './view';
import { ViewModel } from './view-model';

const boardSize = 8;

try {
    const model = new Model(boardSize, boardSize);
    const view = new View();
    const viewModel = new ViewModel(model, view);

    viewModel.bootstrap();
} catch (error) {
    console.log(error);
}

