import * as PIXI from "pixi.js"
import { State, TankState, Position } from "../shared/State"

type Drawing = {
  graphics: PIXI.Graphics
  object: Position
  id: string
}

type RenderState = {
  tanks: Drawing[]
}

export default class GameRenderer {
  private app: PIXI.Application
  private renderState: RenderState

  constructor({ app }: { app: PIXI.Application }) {
    this.app = app
    this.renderState = {
      tanks: [],
    }
  }

  render = (state: State) => {
    const tanksToAdd = state.tanks.filter((newTank: TankState) => {
      return !this.renderState.tanks.find(
        oldTank => oldTank.id === this.tankId(newTank)
      )
    })
    const tanksToRemove = this.renderState.tanks.filter((oldTank: Drawing) => {
      return !state.tanks.find(newTank => oldTank.id === this.tankId(newTank))
    })

    const existingTanks = state.tanks.filter((newTank: TankState) => {
      return this.renderState.tanks.find(
        oldTank => oldTank.id === this.tankId(newTank)
      )
    })

    tanksToRemove.forEach(drawing => {
      console.log("removing tank", drawing)
      drawing.graphics.destroy()
      this.renderState.tanks = this.renderState.tanks.filter(t => t !== drawing)
    })

    tanksToAdd.forEach(tank => {
      this.renderTank(tank)
    })

    existingTanks.forEach(newTank => {
      const drawing = this.renderState.tanks.find(
        oldTank => oldTank.id === this.tankId(newTank)
      )
      if (!drawing) throw new Error("Couldn't find drawing")
      this.updateTank({ tank: newTank, drawing })
    })
  }

  private renderTank = (tank: TankState) => {
    const graphics = new PIXI.Graphics()
    graphics.beginFill(0xde3249)
    graphics.drawRect(0, 0, 20, 20)
    graphics.endFill()
    this.setCoords(graphics, tank)
    console.log(graphics)
    this.app.stage.addChild(graphics)
    const drawing = {
      graphics,
      object: tank,
      id: this.tankId(tank),
    }
    this.renderState.tanks.push(drawing)
    console.log("rendered tank", drawing)
  }

  private updateTank = ({
    tank,
    drawing,
  }: {
    tank: TankState
    drawing: Drawing
  }) => {
    // console.log("update tank", tank, drawing)
    this.setCoords(drawing.graphics, tank)
  }

  private tankId = (tank: TankState) => {
    return `tank-${tank.userId}`
  }

  private setCoords = (graphics: PIXI.Graphics, object: Position) => {
    const x = this.getX(object.x)
    const y = this.getY(object.y) - graphics.height
    graphics.x = x
    graphics.y = y
  }

  getX = (x: number): number => {
    return x
  }

  getY = (y: number): number => {
    return this.app.view.height - y
  }
}
