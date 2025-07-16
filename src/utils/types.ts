export type Point = {
    x: number,
    y: number
}

export type Stroke = {
    points: Point[],
    color: string,
    size: number,
    toolForm: string
}