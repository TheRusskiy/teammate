import { WebsocketTransport } from "../WebsocketTransport"
import { ClientCommand } from "../shared/ClientCommand"

export type OnClientCommand = (
  command: ClientCommand,
  client: GameClient
) => void

export default class GameClient {
  private transport: WebsocketTransport
  private identifier: string

  constructor({
    transport,
    identifier,
  }: {
    transport: WebsocketTransport
    identifier: string
  }) {
    this.transport = transport
    this.identifier = identifier
  }

  public onClientCommand = (callback: OnClientCommand): void => {
    this.getTransport().onClientCommand(command => {
      if (command.userId !== this.getIdentifier()) {
        console.warn("User Id doesn't match, command ignored")
        return
      }
      callback(command, this)
    })
  }

  public getTransport = (): WebsocketTransport => {
    return this.transport
  }

  public getIdentifier = (): string => {
    return this.identifier
  }
}
