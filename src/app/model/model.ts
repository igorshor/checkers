import { Board } from "./models/board";
import { CheckersPositionStrategy } from "./models/checkers-position-strategy";
import { Player, AiPlayer } from "./models/player";
import { Configurations } from "./api/models/game-configurations";

export class Model {
    public board: Board;
    constructor(configurations: Configurations) {
        const players: Player[] = [];
        players.push(new Player(configurations.players[0], 1, 1));
        players.push(configurations.computer ?
            new AiPlayer('computer', 2, configurations.size) :
            new Player(configurations.players[1], 2, configurations.size));
        this.board = new Board(configurations.size, new CheckersPositionStrategy(configurations.size, players));
    }
}