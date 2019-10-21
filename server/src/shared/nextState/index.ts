import { Action } from "../Action"
import { State, MutableState } from "../State"
import produce from "immer"

const initialState: State = {
  players: [],
  texts: [],
  ms: 0,
  tanks: [],
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
          return
        }
        case "stop-up": {
          tank.ySpeed = 0
          return
        }
        case "down": {
          tank.ySpeed = -1
          return
        }
        case "stop-down": {
          tank.ySpeed = 0
          return
        }
        case "left": {
          tank.xSpeed = -1
          return
        }
        case "stop-left": {
          tank.xSpeed = 0
          return
        }
        case "right": {
          tank.xSpeed = 1
          return
        }
        case "stop-right": {
          tank.xSpeed = 0
          return
        }
      }
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
