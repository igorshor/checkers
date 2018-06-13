import { Checker } from "./checker";
import { CellBuilder } from "../../common/builders/cell-builder";

export class CheckrsCellBuilder extends CellBuilder<Checker> {
    createElement(id: any): Checker {
        return id ? new Checker(id) : undefined;
    }
}