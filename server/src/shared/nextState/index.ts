import { Action } from "../Action"
import { State, MutableState } from "../State"
import produce from "immer"

const initialState: State = {
  players: [],
  texts: [],
  ms: 0,
  arrowsStates: {},
}

const reducer = (draft: MutableState, action?: Action) => {
  if (!action) return

  switch (action.type) {
    case "some-action":
      return
    case "ARROW": {
      draft.arrowsStates[action.userId][action.data.direction] += 1
      return
    }
    case "TICK": {
      draft.ms += action.data.ms
      return
    }
    case "ADD_USER": {
      if (draft.players.find(p => p.id === action.data.user.id)) {
        console.warn("This user is already in the game")
        return
      }
      draft.players.push(action.data.user)
      draft.arrowsStates[action.data.user.id] = { left: 0, right: 0 }
      return
    }
    case "REMOVE_USER": {
      delete draft.arrowsStates[action.data.userId]
    }
  }
}

type baseReducer = (state: MutableState, action?: Action) => void

const nextState = produce<baseReducer>(reducer, initialState)

export default nextState
