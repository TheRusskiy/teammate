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
type IdGeneratedCommand = GenericCommand & {
  type: "ID_GENERATED"
  data: {
    id: string
  }
}

export type ServerCommand = SetStateCommand | IdGeneratedCommand
