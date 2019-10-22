import { Action } from "../Action"
import { State, MutableState, TankState } from "../State"
import produce from "immer"

const initialState: State = {
  players: [],
  texts: [],
  ms: 0,
  tanks: [],
}

const setRotation = (tank: TankState) => {
  const { ySpeed: y, xSpeed: x } = tank
  if (x > 0 && y == 0) {
    tank.rotation = 0
  } else if (x > 0 && y < 0) {
    tank.rotation = 45
  } else if (x == 0 && y < 0) {
    tank.rotation = 90
  } else if (x < 0 && y < 0) {
    tank.rotation = 135
  } else if (x < 0 && y == 0) {
    tank.rotation = 180
  } else if (x < 0 && y > 0) {
    tank.rotation = 225
  } else if (x == 0 && y > 0) {
    tank.rotation = 270
  } else if (x > 0 && y > 0) {
    tank.rotation = 315
  }
}

const reducer = (draft: MutableState, action?: Action) => {
  if (!action) return

  switch (action.type) {
    case "some-action":
      return
    case "MOVE_TANK": {
      const tank = draft.tanks.find(t => t.userId === action.userId)
      if (!tank) return
      switch (action.data.direction) {
        case "up": {
          tank.ySpeed = 1
          break
        }
        case "stop-up": {
          tank.ySpeed = 0
          break
        }
        case "down": {
          tank.ySpeed = -1
          break
        }
        case "stop-down": {
          tank.ySpeed = 0
          break
        }
        case "left": {
          tank.xSpeed = -1
          break
        }
        case "stop-left": {
          tank.xSpeed = 0
          break
        }
        case "right": {
          tank.xSpeed = 1
          break
        }
        case "stop-right": {
          tank.xSpeed = 0
          break
        }
      }
      setRotation(tank)
      return
    }
    case "TICK": {
      draft.ms += action.data.ms
      draft.tanks.forEach(tank => {
        tank.x += tank.xSpeed
        tank.y += tank.ySpeed
      })
      return
    }
    case "ADD_USER": {
      if (draft.players.find(p => p.id === action.data.user.id)) {
        console.warn("This user is already in the game")
        return
      }
      draft.players.push(action.data.user)
      draft.tanks.push({
        x: 0,
        y: 0,
        xSpeed: 0,
        ySpeed: 0,
        userId: action.data.user.id,
        rotation: 0,
      })
      return
    }
    case "REMOVE_USER": {
      draft.players = draft.players.filter(p => p.id !== action.data.userId)
      draft.tanks = draft.tanks.filter(t => t.userId !== action.data.userId)
    }
  }
}

type baseReducer = (state: MutableState, action?: Action) => void

const nextState = produce<baseReducer>(reducer, initialState)

export default nextState
