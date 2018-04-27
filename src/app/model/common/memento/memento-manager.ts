export class MementoManager<T> {
    public _saved: T[];
    public _temp: T[];

    save(memento: T) {
        this._saved.push(memento);
        this.clearTemp();
    }

    undo() {
        if (this._saved && this._saved.length) {
            this._temp.push(this._saved.pop());
        }
    }

    redo() {
        if (this._temp && this._temp.length) {
            this._saved.push(this._temp.pop());
        }
    }

    private clearTemp() {
        if (this._temp.length) {
            this._temp = [];
        }
    }

    private clearSaved() {
        if (this._saved.length) {
            this._saved = [];
        }
    }

    reset() {
        this.clearSaved();
        this.clearTemp();
    }
}