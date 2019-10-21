import * as http from "http"
import WebsocketServer, { WebsocketTransport } from "./WebsocketTransport"
import Game from "./Game"

const setupWebsocketServer = ({ server }: { server: http.Server }) => {
  const onConnected = (transport: WebsocketTransport) => {
    console.log("connected")
    const game = new Game({ transport })
    game.start()
    transport.onClose(() => {
      console.log("disconnected")
      game.stop()
    })
  }

  WebsocketServer({
    server,
    onConnected,
  })

  console.log("Websocket is setup")
}

export default setupWebsocketServer
