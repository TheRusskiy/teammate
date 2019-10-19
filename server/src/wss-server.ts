import * as http from "http"
import WebSocket from "ws"

const setupWebsocketServer = ({ server }: { server: http.Server }) => {
  const wss = new WebSocket.Server({ server })

  console.log("Websocket is setup")

  wss.on("connection", function connection(ws) {
    ws.on("message", function incoming(message) {
      console.log("received: %s", message)
    })

    ws.send("something")

    ws.on("close", function close() {
      console.log("disconnected")
    })
  })
}

export default setupWebsocketServer
