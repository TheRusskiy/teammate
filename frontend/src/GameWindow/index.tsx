import React, { useEffect, useState, MouseEvent } from "react"
import WebsocketTransport, { Transport } from "../WebsocketTransport"
import { ServerCommand } from "../shared/ServerCommand"

const Game: React.FC = () => {
  const [gameState, setGameState] = useState({})
  const [transport, setTransport] = useState()
  const [userId, setUserId] = useState()
  useEffect(() => {
    const onConnect = (t: Transport) => {
      console.log("connected")
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
        case "ID_GENERATED": {
          setUserId(command.data.id)
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

    setTransport(transport)

    return () => {
      transport.close()
    }
  }, [])
  const startGame = (event: MouseEvent) => {
    event.preventDefault()
    transport.command({
      type: "START_GAME",
      userId,
    })
  }
  return (
    <div>
      <span>Game</span>
      <br />
      <a href="#" onClick={startGame}>
        Start Game
      </a>
      <pre>{JSON.stringify(gameState, null, 2)}</pre>
    </div>
  )
}

export default Game
