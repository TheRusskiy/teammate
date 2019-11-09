import React from "react"
import { State } from "../shared/State"
import Tank from "./Tank"

type Props = {
  gameState: State
}
function GameCanvas({ gameState }: Props) {
  return (
    <>
      {gameState.tanks.map(t => (
        <Tank tank={t} key={t.userId} />
      ))}
    </>
  )
}

export default React.memo(GameCanvas)
