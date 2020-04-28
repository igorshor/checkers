import { Checker } from "./checker";
import { CellBuilder } from "../../common/builders/cell-builder";
import { Players } from "../../common/player/players";
import { KingChecker } from "./king-checker";
import { IPosition } from "../../common/board/position";

export interface IKingMaker{
    createKingElement(Checker: Checker): Checker;
}

export class CheckrsBuilder extends CellBuilder<Checker> implements IKingMaker {
    constructor(private _playerManager: Players<Checker>) {
        super()
    }
    createElement(id: number, associatedId: string, position: IPosition): Checker {
        return associatedId ? new Checker(id, associatedId, this._playerManager.get(associatedId).direction, position, this) : undefined;
    }

    createKingElement(Checker: Checker): Checker {
        return Checker.correlationId ? new KingChecker(Checker, this) : undefined;
    }
}