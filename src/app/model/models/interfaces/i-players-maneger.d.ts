import { Player } from "../game/player";

export interface IPlayersManager {
    switch(): void;
    readonly current: Player;
    readonly opponent: Player;
    exist(id: any): boolean;
}