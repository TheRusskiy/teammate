import { ClientCommand } from "../shared/ClientCommand"

export type Transport = {
  close: () => void
  command: (command: ClientCommand) => void
}

type OnConnect = (transport: Transport) => void
type OnMessage = (data: any) => void
type OnClose = () => void

type TransportOptions = {
  host: string
  onConnect: OnConnect
  onClose?: OnClose
  onMessage: OnMessage
}

export default function WebsocketTransport({
  host,
  onConnect,
  onClose,
  onMessage,
}: TransportOptions): Transport {
  const ws = new WebSocket(host)

  const close = () => ws.close()

  const command = (command: ClientCommand) => {
    ws.send(JSON.stringify(command))
  }

  const transport = {
    close,
    command,
  }

  ws.addEventListener("open", () => {
    onConnect(transport)
  })

  if (onClose) {
    ws.addEventListener("close", onClose)
  }

  ws.addEventListener("message", function(event) {
    const data = JSON.parse(event.data)
    onMessage(data)
  })

  return transport
}
