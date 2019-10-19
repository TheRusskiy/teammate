type COMMAND_TYPE = "START"

const command = ({
  commandType,
  data,
}: {
  commandType: COMMAND_TYPE
  data: object
}): { commandType: COMMAND_TYPE; data: object } => {
  return {
    commandType,
    data,
  }
}
