import React from "react";
import { BoardStore } from "../stores/board.store";
import { Position } from "../../models/position.model";

export interface CellProps {
    position: Position;
}

export class CellComponent extends React.Component<CellProps, {}> {

}