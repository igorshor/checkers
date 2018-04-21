
export enum State {
    Game,
    Dead,
    King
}
export class Checker {
    public state: State;
    constructor(public id:any){
    }
}