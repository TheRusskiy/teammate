type GenericCommand = {
  type: string
  data?: object
}

type StartGameCommand = GenericCommand & {
  type: "START_GAME"
}

type ActionCommand = GenericCommand & {
  type: "ACTION",
  data: {}
}

export type ClientCommand = StartGameCommand | ActionCommand
