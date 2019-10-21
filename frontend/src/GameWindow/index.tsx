import React from "react"
import { State } from "../shared/State"
import * as PIXI from "pixi.js"
import GameRenderer from "../GameRenderer"

type Props = { gameState: State }

class GameWindow extends React.Component<Props> {
  private root: HTMLElement | undefined
  private app: PIXI.Application | undefined
  private renderer: GameRenderer | undefined

  componentDidMount(): void {
    const root = document.getElementById("game-window")
    if (!root) throw new Error("#game-window not found")
    const app = new PIXI.Application({
      antialias: true,
      width: 256,
      height: 256,
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
