import React, { useEffect, useState } from "react"
import WebsocketTransport, { Transport } from "../WebsocketTransport"
import { ServerCommand } from "../shared/ServerCommand"

const Game: React.FC = () => {
  const [gameState, setGameState] = useState({})
  useEffect(() => {
    const onConnect = (t: Transport) => {
      console.log("connected")
      t.command({ type: "START_GAME" })
    }

    const onClose = () => {
      console.log("disconnected")
    }

    const onMessage = (data: any) => {
      const command: ServerCommand = data
      console.log(command)
      switch (command.type) {
        case "SET_STATE": {
          setGameState(command.data.state)
          break
        }
      }
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
  }, [])
  return (
    <div>
      <span>Game</span>
      <br />
      <pre>{JSON.stringify(gameState)}</pre>
    </div>
  )
}

export default Game
