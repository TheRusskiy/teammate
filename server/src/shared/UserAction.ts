import { BaseAction } from "./BaseAction"

type BaseUserAction = BaseAction & {
  userId: string
}

type SomeAction = BaseUserAction & {
  type: "some-action"
  data: {
    something: string
  }
}

type ArrowAction = BaseUserAction & {
  type: "ARROW"
  data: {
    direction: "left" | "right"
  }
}

export type UserAction = SomeAction | ArrowAction
