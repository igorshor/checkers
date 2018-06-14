import { Checker } from "./checker";
import { CellBuilder } from "../../common/builders/cell-builder";

export class CheckrsCellBuilder extends CellBuilder<Checker> {
    createElement(id: number, associatedId: string): Checker {
        return associatedId ? new Checker(id, associatedId) : undefined;
    }
}