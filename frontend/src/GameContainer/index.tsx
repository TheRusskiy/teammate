import React, { MouseEvent } from "react"
import WebsocketTransport, { Transport } from "../WebsocketTransport"
import { ServerCommand } from "../shared/ServerCommand"
import { State } from "../shared/State"
import GameWindow from "../GameWindow"
import { MoveDirection } from "../shared/UserAction"
import Keyboard from "../Keyboard"

type Props = {}
type ComponentState = {
  transport?: Transport
  gameState?: State
  userId?: string
}
class GameContainer extends React.Component<Props> {
  state: ComponentState = {}

  componentDidMount() {
    const onConnect = (t: Transport) => {
      console.log("connected")
    }

    const onClose = () => {
      console.log("disconnected")
    }

    // "ws://85.236.188.110:26501"
    const transport = WebsocketTransport({
      host: "ws://localhost:3001",
      onConnect,
      onClose,
      onMessage: this.onMessage,
    })

    this.setState({
      transport,
    })
  }

  onMessage = (data: any) => {
    const command: ServerCommand = data
    // console.log(command)
    switch (command.type) {
      case "SET_STATE": {
        this.setState({
          gameState: command.data.state,
        })
        break
      }
      case "ID_GENERATED": {
        this.setState({
          userId: command.data.id,
        })
        break
      }
    }
  }

  componentWillUnmount() {
    if (this.state.transport) {
      this.state.transport.close()
    }
  }

  startGame = (event: MouseEvent) => {
    event.preventDefault()
    if (!this.state.transport || !this.state.userId) return
    this.state.transport.command({
      type: "START_GAME",
      userId: this.state.userId,
    })
  }

  moveInDirection = (transport?: Transport, direction?: MoveDirection) => {
    const { userId } = this.state
    if (!userId || !transport || !direction) return
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

  moveUp = () => {
    this.moveInDirection(this.state.transport, "up")
  }

  stopMoveUp = () => {
    this.moveInDirection(this.state.transport, "stop-up")
  }

  moveDown = () => {
    this.moveInDirection(this.state.transport, "down")
  }

  stopMoveDown = () => {
    this.moveInDirection(this.state.transport, "stop-down")
  }

  moveLeft = () => {
    this.moveInDirection(this.state.transport, "left")
  }

  stopMoveLeft = () => {
    this.moveInDirection(this.state.transport, "stop-left")
  }

  moveRight = () => {
    this.moveInDirection(this.state.transport, "right")
  }

  stopMoveRight = () => {
    this.moveInDirection(this.state.transport, "stop-right")
  }

  render() {
    const { transport, gameState } = this.state
    return (
      <div>
        <span>Game</span>
        <br />
        <a href="#" onClick={this.startGame}>
          Start Game
        </a>
        <pre>{JSON.stringify(gameState, null, 2)}</pre>
        {gameState && <GameWindow gameState={gameState} />}
        {transport && (
          <>
            <Keyboard
              keyValue="ArrowUp"
              onPress={this.moveUp}
              onRelease={this.stopMoveUp}
            />
            <Keyboard
              keyValue="ArrowDown"
              onPress={this.moveDown}
              onRelease={this.stopMoveDown}
            />
            <Keyboard
              keyValue="ArrowLeft"
              onPress={this.moveLeft}
              onRelease={this.stopMoveLeft}
            />
            <Keyboard
              keyValue="ArrowRight"
              onPress={this.moveRight}
              onRelease={this.stopMoveRight}
            />
          </>
        )}
      </div>
    )
  }
}

export default GameContainer
