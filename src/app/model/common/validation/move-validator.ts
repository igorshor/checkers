import { IMoveValidatorInterceptor, IMoveValidator } from "../interfaces/i-move-validator-interceptorr";
import { MoveDescriptor } from "../descriptor/move-descriptor";
import { Board } from "../board/board";
import { IIdentible } from "../interfaces/i-Identible";
import { Player } from "../player/player";
import { IMoveAnalyzer } from "../interfaces/i-move-analyzer";

export class MoveValidator<T extends IIdentible> implements IMoveValidator<T> {
    private _validatorInterseptors: IMoveValidatorInterceptor<T>[];

    constructor() {
        this._validatorInterseptors = [];
    }

    public append(validator: IMoveValidatorInterceptor<T>): void {
        this._validatorInterseptors.push(validator);
    }

    public validate(moveDescriptor: MoveDescriptor, board: Board<T>, player: Player<T>, moveAnalizer: IMoveAnalyzer<T>): boolean {
        if (this._validatorInterseptors.length) {
            try {
                this._validatorInterseptors.forEach((validator: IMoveValidatorInterceptor<T>) => {
                    if (!validator.validate(moveDescriptor, board, player, moveAnalizer)) {
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