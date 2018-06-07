import { Model } from './model';
import { View } from './view';
import { Controller } from './controller';
import { ViewModel } from './view-model';

const boardSize = 10;

const model = new Model(boardSize, boardSize);
const viewModel = new ViewModel(model.gameState);
const view = new View(viewModel);
const controller = new Controller(model, view);
