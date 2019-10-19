import { State } from "./State"

type GenericCommand = {
  type: string
  data?: object
}

type SetStateCommand = GenericCommand & {
  type: "SET_STATE"
  data: {
    state: State
  }
}

export type ServerCommand = SetStateCommand
