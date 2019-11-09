import { CustomPIXIComponent } from "react-pixi-fiber"
import * as PIXI from "pixi.js"
import {
  TankState,
  TANK_HEIGHT,
  TANK_WIDTH,
  TANK_GUN_WIDTH,
  TANK_GUN_HEIGHT,
} from "../shared/State"
import { setCoords } from "./utils"

const TYPE = "Tank"

type Props = { tank: TankState }

export const behavior = {
  customDisplayObject: (props: Props) => new PIXI.Graphics(),
  customApplyProps: function(
    instance: PIXI.Graphics,
    oldProps: Props,
    newProps: Props
  ) {
    instance.clear()
    instance.beginFill(0x00aa00)
    instance.drawRect(0, 0, TANK_WIDTH, TANK_HEIGHT)
    instance.drawRect(
      TANK_WIDTH,
      TANK_HEIGHT / 2 - TANK_GUN_WIDTH / 2,
      TANK_GUN_HEIGHT,
      TANK_GUN_WIDTH
    )
    instance.endFill()
    setCoords(instance, newProps.tank)
    instance.angle = newProps.tank.rotation
    instance.pivot = new PIXI.Point(10, 10)
  },
}

export default CustomPIXIComponent(behavior, TYPE)
