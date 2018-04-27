import { CellBuilder } from "./cell-builder";
import { Checker } from "../../checkers/board/checker";

export class CheckrsCellBuilder extends CellBuilder<Checker> {
    createElement(id: any): Checker {
        return id ? new Checker(id) : undefined;
    }
}