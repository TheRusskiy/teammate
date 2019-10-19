import { WebsocketTransport } from "../WebsocketTransport"
import { ClientCommand } from "../shared/ClientCommand"
import nextState from "../shared/nextState"
import { State } from "../shared/State"
const uuidv1 = require("uuid/v1")

export default class Game {
  private transport: WebsocketTransport
  private state: State

  constructor({ transport }: { transport: WebsocketTransport }) {
    this.transport = transport
    transport.onClientCommand(this.onClientCommand)
    this.setState(nextState())
  }

  stop() {
    // todo
  }

  private setState = (state: State) => {
    this.state = state
    console.log(this.state)
    this.transport.sendServerCommand({
      type: "SET_STATE",
      data: {
        state,
      },
    })
  }

  private onClientCommand = (command: ClientCommand) => {
    console.log(command)
    switch (command.type) {
      case "START_GAME": {
        this.setState(
          nextState(this.state, {
            server: true,
            type: "ADD_USER",
            data: { user: { id: uuidv1() } },
          })
        )
        break
      }
      case "PLAYER_ACTION": {
        this.setState(nextState(this.state, command.data.action))
        break
      }
    }
  }
}
