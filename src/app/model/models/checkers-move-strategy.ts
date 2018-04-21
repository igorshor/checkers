import { PositionDefinition } from "./position";
import { Board } from "./board";
import { Player } from "./player";
import { GameState } from "./state";
import { CheckersMoveValidator } from "./move-validator";

export interface IMoveStrategy{
    move(from:PositionDefinition, to:PositionDefinition):boolean;
}

export class CheckersMoveStrategy implements IMoveStrategy {
    private _currentPlayer:Player;
    private _validator:CheckersMoveValidator;
    constructor(private _board:Board, private _state:GameState){
        this._state.player.subscribe((player:Player)=> this._currentPlayer = player);
        this._validator = new CheckersMoveValidator()
    }
    
    move(from: PositionDefinition, to: PositionDefinition): boolean {
        throw new Error("Method not implemented.");
    }
}