import { State } from "./State"

type GenericCommand = {
  type: string
  data?: object
}

type SetStateCommand = GenericCommand & {
  type: "SET_STATE"
  data: {
    time: number
    state: State
  }
}
type IdGeneratedCommand = GenericCommand & {
  type: "ID_GENERATED"
  data: {
    id: string
  }
}

type SetTimeCommand = GenericCommand & {
  type: "SET_TIME"
  data: {
    unixTime: number
  }
}

export type ServerCommand =
  | SetStateCommand
  | IdGeneratedCommand
  | SetTimeCommand
