import { Player } from "../game/player";

export interface IPlayersManager {
    switch(): void;
    addPlayer(player: Player): void;
    readonly players:Player[];
    readonly current: Player;
    readonly opponent: Player;
    exist(id: any): boolean;
}