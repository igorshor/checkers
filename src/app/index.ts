import { Model } from './model';
import { View } from './view';
import { Controller } from './view-model';

const boardSize = 10;

const model = new Model(boardSize, boardSize);
const controller = new Controller(model);
const view = new View(controller);