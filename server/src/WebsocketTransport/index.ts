import * as http from "http"
import WebSocket from "ws"
import { ClientCommand } from "../shared/ClientCommand"
import _ from "lodash"
import { ServerCommand } from "../shared/ServerCommand"
import { OnClientCommand } from "../GameClient"

type OnConnected = (transport: WebsocketTransport) => void

type OnClose = () => void

type TransportOptions = {
  server: http.Server
  onConnected: OnConnected
  onClose?: OnClose
}

type removeCallback = () => void

export type WebsocketTransport = {
  onClientCommand: (callback: OnClientCommand) => void
  onClose: (callback: OnClose) => void
  sendServerCommand: (serverCommand: ServerCommand) => void
}

export default function WebsocketServer({
  server,
  onConnected,
}: TransportOptions): void {
  const wss = new WebSocket.Server({ server })
  wss.on("connection", function connection(ws) {
    const onClientCommandListeners: OnClientCommand[] = []

    const onClientCommand = (callback: OnClientCommand): removeCallback => {
      onClientCommandListeners.push(callback)
      return () => {
        _.remove(onClientCommandListeners, callback)
      }
    }

    ws.on("message", function incoming(message: string) {
      const command: ClientCommand = JSON.parse(message)
      onClientCommandListeners.forEach(listener => {
        listener(command)
      })
    })

    let onCloseListeners: OnClose[] = []

    const onClose = (callback: () => void): removeCallback => {
      onCloseListeners.push(callback)
      return () => {
        _.remove(onCloseListeners, callback)
      }
    }

    ws.on("close", function close() {
      onCloseListeners.forEach(listener => {
        listener()
      })
    })

    const sendServerCommand = (serverCommand: ServerCommand) => {
      ws.send(JSON.stringify(serverCommand))
    }

    const transport: WebsocketTransport = {
      onClientCommand,
      onClose,
      sendServerCommand,
    }

    onConnected(transport)
  })
}
