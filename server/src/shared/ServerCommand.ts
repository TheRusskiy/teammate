export type SERVER_COMMAND_TYPE = "SET_STATE"

export type ServerCommand = {
  commandType: SERVER_COMMAND_TYPE
  data?: object
}

