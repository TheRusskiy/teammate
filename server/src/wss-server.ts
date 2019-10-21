import * as http from "http"
import WebsocketServer, { WebsocketTransport } from "./WebsocketTransport"
import Game from "./Game"

let game: Game = null

const setupWebsocketServer = ({ server }: { server: http.Server }) => {
  const onConnected = (transport: WebsocketTransport) => {
    console.log("connected")
    if (!game) {
      game = new Game()
      game.start()
    }
    const removeClient = game.addClient(transport)
    transport.onClose(() => {
      console.log("disconnected")
      removeClient()
    })
  }

  WebsocketServer({
    server,
    onConnected,
  })

  console.log("Websocket is setup")
}

export default setupWebsocketServer
