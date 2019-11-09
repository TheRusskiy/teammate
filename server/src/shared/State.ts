import { Player } from "./Player"
import { DeepReadonly } from "ts-essentials"

export const MAP_HEIGHT = 512
export const MAP_WIDTH = 512
export const TANK_WIDTH = 20
export const TANK_GUN_WIDTH = 4
export const TANK_HEIGHT = 20
export const TANK_GUN_HEIGHT = 8

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

export type ProjectileState = Position & {
  xSpeed: number
  ySpeed: number
  angle: number
}

export type MutableState = {
  players: Player[]
  ms: number
  tanks: TankState[]
  projectiles: ProjectileState[]
}

export type State = DeepReadonly<MutableState>
