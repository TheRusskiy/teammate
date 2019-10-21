import { Player } from "./Player"
import { DeepReadonly } from "ts-essentials"

type ArrowState = {
  left: number
  right: number
}

export type MutableState = {
  players: Player[]
  texts: string[]
  ms: number
  arrowsStates: { [id: string]: ArrowState }
}

export type State = DeepReadonly<MutableState>
