import * as http from "http"
import WebsocketServer, { WebsocketTransport } from "./WebsocketTransport"
import Game from "./Game"
import GameClient from "./GameClient"
const uuidv1 = require("uuid/v1")

let game: Game = null

const setupWebsocketServer = ({ server }: { server: http.Server }) => {
  const onConnected = (transport: WebsocketTransport) => {
    console.log("connected")
    if (!game) {
      game = new Game()
      game.start()
    }
    const client = new GameClient({
      identifier: uuidv1(),
      transport,
    })

    const removeClient = game.addClient(client)
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
