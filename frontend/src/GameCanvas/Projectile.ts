import { CustomPIXIComponent } from "react-pixi-fiber"
import * as PIXI from "pixi.js"
import { ProjectileState } from "../shared/State"
import { setCoords } from "./utils"

const TYPE = "Projectile"

type Props = { projectile: ProjectileState }

export const behavior = {
  customDisplayObject: (props: Props) => new PIXI.Graphics(),
  customApplyProps: function(
    instance: PIXI.Graphics,
    oldProps: Props,
    newProps: Props
  ) {
    instance.clear()
    instance.beginFill(0xde3249)
    instance.drawCircle(0, 0, 3)
    instance.endFill()
    setCoords(instance, newProps.projectile)
  },
}
export default CustomPIXIComponent(behavior, TYPE)
