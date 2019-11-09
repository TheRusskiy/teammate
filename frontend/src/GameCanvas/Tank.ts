import { CustomPIXIComponent } from "react-pixi-fiber"
import * as PIXI from "pixi.js"
import { MAP_HEIGHT, TankState, Position } from "../shared/State"

const TYPE = "Tank"

const getX = (x: number): number => {
  return x
}

const getY = (y: number): number => {
  return MAP_HEIGHT - y
}

const setCoords = (graphics: PIXI.Graphics, object: Position) => {
  const x = getX(object.x)
  const y = getY(object.y) - graphics.height
  graphics.x = x
  graphics.y = y
}

type Props = { tank: TankState }

export const behavior = {
  customDisplayObject: (props: Props) => new PIXI.Graphics(),
  customApplyProps: function(
    instance: PIXI.Graphics,
    oldProps: Props,
    newProps: Props
  ) {
    instance.clear()
    instance.beginFill(0xde3249)
    instance.drawRect(0 - 10, 0 - 10, 20, 20)
    instance.drawRect(20 - 10, 8 - 10, 8, 4)
    instance.endFill()
    setCoords(instance, newProps.tank)
    instance.angle = newProps.tank.rotation
  },
}
export default CustomPIXIComponent(behavior, TYPE)
