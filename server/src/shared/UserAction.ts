import { BaseAction } from "./BaseAction"

type SomeAction = BaseAction & {
  type: "some-action"
  data: {
    something: string
  }
}

export type UserAction = SomeAction
