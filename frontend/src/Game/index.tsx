import React, { useEffect } from "react"
import WebsocketTransport, { Transport } from "../WebsocketTransport"

const Game: React.FC = () => {
  useEffect(() => {
    const onConnect = (t: Transport) => {
      console.log("connected")
      t.command({ commandType: "START_GAME" })
    }

    const onClose = () => {
      console.log("disconnected")
    }

    const onMessage = (data: object) => {
      console.log(data)
    }

    const transport = WebsocketTransport({
      host: "ws://localhost:3001",
      onConnect,
      onClose,
      onMessage,
    })

    return () => {
      transport.close()
    }
  })
  return <span>Game</span>
}

export default Game
