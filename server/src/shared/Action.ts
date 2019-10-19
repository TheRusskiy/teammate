type ACTION_TYPE = "some-action"

interface BaseAction {
  type: string
  data: object
}

type SomeAction = {
  type: "some-action"
  data: {
    something: string
  }
}

type OtherAction = {
  type: "other-action"
  data: {
    other: string
  }
}

export type Action = SomeAction | OtherAction
