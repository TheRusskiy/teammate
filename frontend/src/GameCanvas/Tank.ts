import { CustomPIXIComponent } from "react-pixi-fiber"
import * as PIXI from "pixi.js"
import { TankState } from "../shared/State"
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
    instance.drawRect(0, 0, 20, 20)
    instance.drawRect(20, 8, 8, 4)
    instance.endFill()
    setCoords(instance, newProps.tank)
    instance.angle = newProps.tank.rotation
    instance.pivot = new PIXI.Point(10, 10)
  },
}

export default CustomPIXIComponent(behavior, TYPE)
