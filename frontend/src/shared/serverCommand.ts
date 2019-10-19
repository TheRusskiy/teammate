export type SERVER_COMMAND_TYPE = "SET_STATE"

export type ServerCommand = {
  commandType: SERVER_COMMAND_TYPE
  data?: object
}

const serverCommand = ({
  commandType,
  data,
}: ServerCommand): { commandType: SERVER_COMMAND_TYPE; data: object } => {
  return {
    commandType,
    data: data || {},
  }
}

export default serverCommand
