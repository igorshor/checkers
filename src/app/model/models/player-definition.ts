import { ComputerLevel } from "./computer-level";

export class PlayerDefinition {
    get computer(): boolean {
        return !!this.computerLevel;
    }

    constructor(public name: string, public id: string, public computerLevel?: ComputerLevel) {

    }
}