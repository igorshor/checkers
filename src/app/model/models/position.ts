export class PositionDefinition {

    get x():number{
        return this._x + this._delta;
    }

    get y():number{
        return this._y + this._delta;
    }

    constructor(private _x: number, private _y: number, private _delta:number) {
        
    }
}