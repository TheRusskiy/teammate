import { Player } from "./Player"
import { DeepReadonly } from "ts-essentials"

export const MAP_HEIGHT = 512
export const MAP_WIDTH = 512
export const TANK_WIDTH = 20
export const TANK_HEIGHT = 20

export type Position = {
  x: number
  y: number
}

export type TankState = Position & {
  userId: string
  xSpeed: number
  ySpeed: number
  rotation: number
}

export type MutableState = {
  players: Player[]
  texts: string[]
  ms: number
  tanks: TankState[]
}

export type State = DeepReadonly<MutableState>
