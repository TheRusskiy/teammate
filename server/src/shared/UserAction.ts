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

export type MoveDirection =
  | "left"
  | "right"
  | "up"
  | "down"
  | "stop-left"
  | "stop-right"
  | "stop-up"
  | "stop-down"

type ArrowAction = BaseUserAction & {
  type: "MOVE_TANK"
  data: {
    direction: MoveDirection
  }
}

type ShootAction = BaseUserAction & {
  type: "TANK_SHOOT"
  data: {
    userId: string
    angle: number
  }
}

export type UserAction = SomeAction | ArrowAction | ShootAction
