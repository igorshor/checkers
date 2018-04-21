import { Board } from "./models/board";
import { CheckersPositionStrategy } from "./models/checkers-position-strategy";
import { Player, AiPlayer } from "./models/player";
import { Configurations } from "./api/models/game-configurations";

export class Model {
    public board: Board;
    constructor(configurations: Configurations) {
        const players: Player[] = [];
        players.push(new Player(1))
        players.push(configurations ? new Player(2) : new AiPlayer(2))
        this.board = new Board(configurations.size, new CheckersPositionStrategy(configurations.size, players))
    }
}