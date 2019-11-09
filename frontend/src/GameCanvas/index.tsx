import React from "react"
import { State } from "../shared/State"
import Tank from "./Tank"
import Projectile from "./Projectile"

type Props = {
  gameState: State
}
function GameCanvas({ gameState }: Props) {
  return (
    <>
      {gameState.tanks.map(t => (
        <Tank tank={t} key={t.userId} />
      ))}
      {gameState.projectiles.map((p, i) => (
        <Projectile projectile={p} key={i} />
      ))}
    </>
  )
}

export default React.memo(GameCanvas)
