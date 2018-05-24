import { Configurations } from "../../model/models/game-configurations";

export class UserApi {
    private _configurations: Configurations;
    public setGame(configurations: Configurations): boolean {
        this._configurations = configurations;

        return true;
    }
}