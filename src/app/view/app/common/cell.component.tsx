import React, { ReactNode } from "react";
import { BoardStore } from "../stores/board.store";
import { Position } from "../../models/position.model";
import { CellType } from "../../models/cell-type.model";

export interface CellProps {
    position: Position;
    type: CellType;
    playerId?: string;
}

export class CellComponent extends React.Component<CellProps, {}> {
    render(): ReactNode {
        if (!this.props.playerId) {
            return undefined;
        }

        return (
            <div>
                <div>fddfd</div>
            </div>
        );
    }
}