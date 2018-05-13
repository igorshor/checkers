import { MoveDescriptor } from "../../common/descriptor/move-descriptor";

export interface IMovePicker {
    calcBestMove(moves: MoveDescriptor[]): MoveDescriptor;
}