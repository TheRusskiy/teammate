import React, { MouseEvent } from "react"
import WebsocketTransport, { Transport } from "../WebsocketTransport"
import { ServerCommand } from "../shared/ServerCommand"
import { State } from "../shared/State"
import GameWindow from "../GameWindow"
import { MoveDirection } from "../shared/UserAction"
import Keyboard from "../Keyboard"
import FrontendGame from "../FrontendGame"
import styled from "styled-components"
import { ClientCommand } from "../../../server/src/shared/ClientCommand"

const WEBSOCKET_HOST = process.env.HOST || 'localhost:3001'

const ControlsWrapper = styled.div`
  display: flex;
  justify-content: center;
`

const StartGameButton = styled.a`
  display: inline-block;
  padding: 10px 20px;
  margin: 20px;
  background-color: #ffa300;
  color: black;
  border-radius: 5px;
  cursor: pointer;
`

const GameWindowWrapper = styled.div`
  display: flex;
  justify-content: center;
`

type Props = {}
type ComponentState = {
  transport?: Transport
  gameState?: State
  userId?: string
}

// const THROTTLE = 0

class GameContainer extends React.Component<Props> {
  state: ComponentState = {}

  private initialDate?: number
  private serverTimeDelta: number
  private game?: FrontendGame
  private gameUnsubscribe?: () => void

  constructor(props: Props) {
    super(props)
    this.serverTimeDelta = 0
  }

  componentDidMount() {
    const onConnect = (t: Transport) => {
      console.log("connected")
    }

    const onClose = () => {
      console.log("disconnected")
    }

    // ws://85.236.188.110:26501
    // ws://224c3ce2.ngrok.io
    const transport = WebsocketTransport({
      host: `ws://${WEBSOCKET_HOST}`,
      onConnect,
      onClose,
      onMessage: this.onMessage,
    })

    this.setState({
      transport,
    })

    this.game = new FrontendGame()
    this.gameUnsubscribe = this.game.subscribe((gameState: State) => {
      this.setGameState(gameState)
    })
    this.game.start()
  }

  onMessage = (data: any) => {
    const command: ServerCommand = data
    switch (command.type) {
      case "SET_STATE": {
        // setTimeout(() => {
        // this.setGameState(command.data.state)
        if (this.game) {
          this.game.addServerTick(command.data.state, command.data.time)
        }
        // }, THROTTLE)
        break
      }
      case "ID_GENERATED": {
        this.setState({
          userId: command.data.id,
        })
        break
      }
      case "SET_TIME": {
        // setTimeout(() => {
        this.updateServerTime(command.data.unixTime)
        // }, THROTTLE)
      }
    }
  }

  updateServerTime = (timeOnServer: number) => {
    if (!this.initialDate) {
      throw new Error("Time is not set")
    }
    const now = new Date().getTime()
    // approximate time to reach server
    const latency = (now - this.initialDate) / 2

    const timeOnServerShouldBe = now - latency
    this.serverTimeDelta = Math.round(timeOnServerShouldBe - timeOnServer)
    if (!this.game) throw new Error("Game is not initialized")
    this.game.setServerTimeDelta(this.serverTimeDelta)
  }

  setGameState = (gameState: State) => {
    this.setState({
      gameState,
    })
  }

  componentWillUnmount() {
    if (this.state.transport) {
      this.state.transport.close()
    }
    if (this.gameUnsubscribe) {
      this.gameUnsubscribe()
    }
    if (this.game) {
      this.game.stop()
    }
  }

  startGame = (event: MouseEvent) => {
    event.preventDefault()
    const unixTime = new Date().getTime()
    this.initialDate = unixTime
    if (!this.state.transport || !this.state.userId) return
    this.executeClientCommand({
      type: "JOIN_GAME",
      userId: this.state.userId,
      data: {
        unixTime,
      },
    })
  }

  executeClientCommand = (command: ClientCommand) => {
    const transport: Transport | undefined = this.state.transport
    const userId: string | undefined = this.state.userId
    const game = this.game
    if (!transport || !userId || !game) return
    game.onClientCommand(command)
    transport.command(command)
  }

  moveInDirection = (direction?: MoveDirection) => {
    const userId = this.state.userId

    if (!direction || !userId) return

    this.executeClientCommand({
      type: "PLAYER_ACTION",
      data: {
        action: {
          type: "MOVE_TANK",
          time: this.getCommandTime(),
          userId,
          data: {
            direction,
          },
          server: false,
        },
      },
      userId,
    })
  }

  moveUp = () => {
    this.moveInDirection("up")
  }

  stopMoveUp = () => {
    this.moveInDirection("stop-up")
  }

  moveDown = () => {
    this.moveInDirection("down")
  }

  stopMoveDown = () => {
    this.moveInDirection("stop-down")
  }

  moveLeft = () => {
    this.moveInDirection("left")
  }

  stopMoveLeft = () => {
    this.moveInDirection("stop-left")
  }

  moveRight = () => {
    this.moveInDirection("right")
  }

  stopMoveRight = () => {
    this.moveInDirection("stop-right")
  }

  shoot = () => {
    const { userId, gameState } = this.state
    if (!userId || !gameState) return
    const tank = gameState.tanks.find(t => t.userId === userId)
    if (!tank) return
    this.executeClientCommand({
      type: "PLAYER_ACTION",
      data: {
        action: {
          type: "TANK_SHOOT",
          time: this.getCommandTime(),
          userId,
          data: {
            userId,
            angle: tank.rotation,
          },
          server: false,
        },
      },
      userId,
    })
  }

  render() {
    const { transport, gameState } = this.state
    return (
      <div>
        <ControlsWrapper>
          <StartGameButton onClick={this.startGame}>Join Game</StartGameButton>
        </ControlsWrapper>
        <GameWindowWrapper>
          {gameState && (
            <GameWindow
              gameState={gameState}
              serverTimeDelta={this.serverTimeDelta}
            />
          )}
        </GameWindowWrapper>
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
            <Keyboard keyValue="Space" onPress={this.shoot} />
          </>
        )}
        <pre>{JSON.stringify(gameState, null, 2)}</pre>
      </div>
    )
  }

  private getCommandTime = (): number => {
    const now = new Date().getTime()
    return now - this.serverTimeDelta
  }
}

export default GameContainer
