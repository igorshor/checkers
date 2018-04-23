import { DirectionsDefinition } from "../move/move-direction";

export class Player {
    constructor(public name: string, public id: any, public base: number, public direction: DirectionsDefinition) {

    }
}

export class AiPlayer extends Player {
    constructor(name: string, id: any, base: number, direction: DirectionsDefinition) {
        super(name, id, base, direction);

    }
}