import * as http from "http"
import { ClientCommand } from "./shared/clientCommand"
import WebsocketServer, { WebsocketTransport } from "./WebsocketTransport"

const setupWebsocketServer = ({ server }: { server: http.Server }) => {
  const onConnected = (transport: WebsocketTransport) => {
    console.log("connected")
    const onClientCommand = (command: ClientCommand) => {
      console.log(command)
    }
    transport.onClientCommand(onClientCommand)
    transport.onClose(() => {
      console.log("disconnected")
    })
  }

  WebsocketServer({
    server,
    onConnected,
  })

  console.log("Websocket is setup")
}

export default setupWebsocketServer
