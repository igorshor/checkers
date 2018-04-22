export class Player {
    constructor(public name: string, public id: any, public base:number) {

    }
}

export class AiPlayer extends Player {
    constructor(name: string, id: any, base:number) {
        super(name, id, base);

    }
}