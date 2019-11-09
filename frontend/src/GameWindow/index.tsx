import React from "react"
import { State, MAP_HEIGHT, MAP_WIDTH } from "../shared/State"
import * as PIXI from "pixi.js"
import GameCanvas from "../GameCanvas"
import { render } from "react-pixi-fiber"

type Props = {
  gameState: State
  setGameState: (gameState: State) => void
  serverTimeDelta: number
}

class GameWindow extends React.PureComponent<Props> {
  private root: HTMLElement | undefined
  private app: PIXI.Application | undefined

  constructor(props: Props) {
    super(props)
    PIXI.utils.skipHello()
  }

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
    this.gameLoop()
  }

  gameLoop = () => {
    this.renderApp(this.props.gameState)
    requestAnimationFrame(this.gameLoop)
  }

  renderApp = (state: State) => {
    if (!this.app) return

    render(<GameCanvas gameState={state} />, this.app.stage)
  }

  render() {
    return <div id="game-window" />
  }
}

export default GameWindow
