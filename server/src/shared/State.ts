import { Player } from "./Player"
import { DeepReadonly } from "ts-essentials"

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
