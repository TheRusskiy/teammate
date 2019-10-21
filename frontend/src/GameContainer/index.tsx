import React, { useEffect, useState, MouseEvent } from "react"
import WebsocketTransport, { Transport } from "../WebsocketTransport"
import { ServerCommand } from "../shared/ServerCommand"
import { State } from "../shared/State"
import nextState from "../shared/nextState"
import GameWindow from "../GameWindow"
import { MoveDirection } from "../shared/UserAction"

const GameContainer: React.FC = () => {
  const [gameState, setGameState] = useState<State>(nextState(undefined))
  const [transport, setTransport] = useState<Transport>()
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
      // console.log(command)
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
    if (!transport) return
    transport.command({
      type: "START_GAME",
      userId,
    })
  }
  const moveInDirection = (transport: Transport, direction: MoveDirection) => {
    transport.command({
      type: "PLAYER_ACTION",
      data: {
        action: {
          type: "MOVE_TANK",
          userId,
          data: {
            direction,
          },
        },
      },
      userId,
    })
  }
  const clickLeft = (event: MouseEvent) => {
    event.preventDefault()
    if (!transport) return
    moveInDirection(transport, "left")
  }
  const clickRight = (event: MouseEvent) => {
    event.preventDefault()
    if (!transport) return
    moveInDirection(transport, "right")
  }
  const clickUp = (event: MouseEvent) => {
    event.preventDefault()
    if (!transport) return
    moveInDirection(transport, "up")
  }
  const clickDown = (event: MouseEvent) => {
    event.preventDefault()
    if (!transport) return
    moveInDirection(transport, "down")
  }
  return (
    <div>
      <span>Game</span>
      <br />
      <a href="#" onClick={startGame}>
        Start Game
      </a>
      <br />
      <a href="#" onClick={clickLeft}>
        Left
      </a>
      <br />
      <a href="#" onClick={clickRight}>
        Right
      </a>
      <br />
      <a href="#" onClick={clickUp}>
        Up
      </a>
      <br />
      <a href="#" onClick={clickDown}>
        Down
      </a>
      <pre>{JSON.stringify(gameState, null, 2)}</pre>
      <GameWindow gameState={gameState} />
    </div>
  )
}

export default GameContainer
