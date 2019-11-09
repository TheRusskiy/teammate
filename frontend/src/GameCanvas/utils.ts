import { MAP_HEIGHT, Position } from "../shared/State"

import * as PIXI from "pixi.js"

export const getX = (x: number): number => {
  return x
}

export const getY = (y: number): number => {
  return MAP_HEIGHT - y
}

export const setCoords = (graphics: PIXI.Graphics, object: Position) => {
  const x = getX(object.x)
  const y = getY(object.y) - graphics.height
  graphics.x = x
  graphics.y = y
}
