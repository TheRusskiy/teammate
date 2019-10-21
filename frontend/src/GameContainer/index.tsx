import React, { useEffect, useState, MouseEvent, useMemo } from "react"
import WebsocketTransport, { Transport } from "../WebsocketTransport"
import { ServerCommand } from "../shared/ServerCommand"
import { State } from "../shared/State"
import nextState from "../shared/nextState"
import GameWindow from "../GameWindow"
import { MoveDirection } from "../shared/UserAction"
import Keyboard from "../Keyboard"

const GameContainer: React.FC = () => {
  const [gameState, setGameState] = useState<State>(nextState(undefined))
  const [transport, setTransport] = useState<Transport>()
  const [userId, setUserId] = useState()

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

  useEffect(() => {
    const onConnect = (t: Transport) => {
      console.log("connected")
    }

    const onClose = () => {
      console.log("disconnected")
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
  const moveInDirection = (
    transport: Transport,
    direction: MoveDirection
  ) => () => {
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

  return (
    <div>
      <span>Game</span>
      <br />
      <a href="#" onClick={startGame}>
        Start Game
      </a>
      <pre>{JSON.stringify(gameState, null, 2)}</pre>
      <GameWindow gameState={gameState} />
      {transport && (
        <>
          <Keyboard
            keyValue="ArrowUp"
            onPress={moveInDirection(transport, "up")}
            onRelease={moveInDirection(transport, "stop-up")}
          />
          <Keyboard
            keyValue="ArrowDown"
            onPress={moveInDirection(transport, "down")}
            onRelease={moveInDirection(transport, "stop-down")}
          />
          <Keyboard
            keyValue="ArrowLeft"
            onPress={moveInDirection(transport, "left")}
            onRelease={moveInDirection(transport, "stop-left")}
          />
          <Keyboard
            keyValue="ArrowRight"
            onPress={moveInDirection(transport, "right")}
            onRelease={moveInDirection(transport, "stop-right")}
          />
        </>
      )}
    </div>
  )
}

export default GameContainer
