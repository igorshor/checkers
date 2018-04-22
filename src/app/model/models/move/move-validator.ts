import { IMoveValidatorInterceptor, IMoveValidator } from "../interfaces/i-move-validator-interceptorr";
import { MoveDescriptor } from "./move-descriptor";
import { Board } from "../board/board";

export class MoveValidator implements IMoveValidator {
    private _validatorInterseptors: IMoveValidatorInterceptor[];

    constructor() {
        this._validatorInterseptors = [];
    }

    public append(validator: IMoveValidatorInterceptor): void {
        this._validatorInterseptors.push(validator);
    }

    public validate(moveDescriptor: MoveDescriptor, board: Board): boolean {
        if (this._validatorInterseptors.length) {
            try {
                this._validatorInterseptors.forEach((validator: IMoveValidatorInterceptor) => {
                    if (!validator.validate(moveDescriptor, board)) {
                        throw new Error(validator.error || 'Invalid move');
                    }
                });
            } catch (e) {
                return false;
            }
        }
        return true;
    }
}