import React from "react"
import { State, MAP_HEIGHT, MAP_WIDTH } from "../shared/State"
import * as PIXI from "pixi.js"
import GameRenderer from "../GameRenderer"
// import nextState from "../shared/nextState"

type Props = {
  gameState: State
  setGameState: (gameState: State) => void
  serverTimeDelta: number
}

// const TICK_MS = 33

class GameWindow extends React.Component<Props> {
  private root: HTMLElement | undefined
  private app: PIXI.Application | undefined
  private renderer: GameRenderer | undefined

  componentDidMount(): void {
    const root = document.getElementById("game-window")
    if (!root) throw new Error("#game-window not found")
    PIXI.utils.skipHello()
    const app = new PIXI.Application({
      antialias: true,
      width: MAP_WIDTH,
      height: MAP_HEIGHT,
    })
    root.appendChild(app.view)
    this.root = root
    this.app = app
    this.renderer = new GameRenderer({ app })
    this.gameLoop()
  }

  getRenderer = (): GameRenderer => {
    if (!this.renderer) throw new Error("Renderer is not initialized")
    return this.renderer
  }

  gameLoop = () => {
    this.renderApp(this.props.gameState)
    // const newState = nextState(this.props.gameState, {
    //   type: 'TICK',
    //   data: {
    //     ms: TICK_MS
    //   }
    // })
    // this.props.setGameState(newState)
    // this.renderApp(this.props.gameState)
    requestAnimationFrame(this.gameLoop)
  }

  renderApp = (state: State) => {
    this.getRenderer().render(state)
  }

  render() {
    return <div id="game-window" />
  }
}

export default GameWindow
