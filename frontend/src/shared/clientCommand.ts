export type CLIENT_COMMAND_TYPE = "START_GAME"

export type ClientCommand = {
  commandType: CLIENT_COMMAND_TYPE
  data?: object
}

const clientCommand = ({
  commandType,
  data,
}: ClientCommand): { commandType: CLIENT_COMMAND_TYPE; data: object } => {
  return {
    commandType,
    data: data || {},
  }
}

export default clientCommand
