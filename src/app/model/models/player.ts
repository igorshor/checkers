export class Player {
    constructor(public name: string, public id: any) {

    }
}

export class AiPlayer extends Player {
    constructor(name: string, id: any) {
        super(name, id);

    }
}