import { Player } from "./Player"

interface BaseAction {
  type: string
  data: object
}

export type UserAction = SomeAction

type SomeAction = BaseAction & {
  type: "some-action"
  data: {
    something: string
  }
}

type BaseServerAction = BaseAction & {
  server: true
}

type AddUserAction = BaseServerAction & {
  type: "ADD_USER"
  data: {
    user: Player
  }
}

export type ServerAction = AddUserAction

export type Action = UserAction | ServerAction
