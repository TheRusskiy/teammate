import { Player } from "./Player"

type ArrowState = {
  left: number
  right: number
}

export type State = {
  players: Player[]
  texts: string[]
  ms: number
  arrowsStates: { [id: string]: ArrowState }
}
