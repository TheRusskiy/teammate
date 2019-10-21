import { Player } from "./Player"
import { BaseAction } from "./BaseAction"

type BaseServerAction = BaseAction & {
  server: true
}

type AddUserAction = BaseServerAction & {
  type: "ADD_USER"
  data: {
    user: Player
  }
}

type RemoveUserAction = BaseServerAction & {
  type: "REMOVE_USER"
  data: {
    userId: string
  }
}

type TickAction = BaseServerAction & {
  type: "TICK"
  data: {
    ms: number
  }
}

export type ServerAction = AddUserAction | TickAction | RemoveUserAction
