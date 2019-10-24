import { UserAction } from "./UserAction"

type GenericCommand = {
  type: string
  userId: string
  data?: object
}

type StartGameCommand = GenericCommand & {
  type: "JOIN_GAME"
  data: {
    unixTime: number
  }
}

type ActionCommand = GenericCommand & {
  type: "PLAYER_ACTION"
  data: {
    action: UserAction
  }
}

export type ClientCommand = StartGameCommand | ActionCommand
