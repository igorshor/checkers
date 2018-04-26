export enum DirectionsDefinition {
    Up = 2,
    Down = 4,
    Left = 8,
    Right = 16
}

export enum MoveDirectionsDefinition {
    UpLeft = DirectionsDefinition.Up | DirectionsDefinition.Left,
    UpRight = DirectionsDefinition.Up | DirectionsDefinition.Right,
    DownLeft = DirectionsDefinition.Down | DirectionsDefinition.Left,
    DownRight = DirectionsDefinition.Down | DirectionsDefinition.Right
}