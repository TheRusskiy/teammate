export type SERVER_COMMAND_TYPE = "SET_STATE"

export type ServerCommand = {
  type: SERVER_COMMAND_TYPE
  data?: object
}

