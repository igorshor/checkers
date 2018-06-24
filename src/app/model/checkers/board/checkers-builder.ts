import { Checker } from "./checker";
import { CellBuilder } from "../../common/builders/cell-builder";
import { Players } from "../../common/player/players";
import { KingChecker } from "./king-checker";
import { IPosition } from "../../common/board/position";

export interface IKingMaker {
    createKingElement(checker: Checker): Checker;
}

export class CheckrsBuilder extends CellBuilder<Checker> implements IKingMaker {
    constructor(private _playerManager: Players<Checker>, private _boardSize: number) {
        super();
    }
    createElement(id: number, associatedId: string, position: IPosition): Checker {
        return associatedId ? new Checker(
            id,
            associatedId,
            this._playerManager.get(associatedId).direction,
            position,
            this._boardSize,
            this
        ) : undefined;
    }

    createKingElement(checker: Checker): Checker {
        return checker.associatedId ? new KingChecker(checker, this) : undefined;
    }
}